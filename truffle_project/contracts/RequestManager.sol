// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Projects.sol";

contract Escrow {
    address public freelancer;
    address public employer;
    uint public amount;

    constructor(address _freelancer, address _employer) payable {
        freelancer = _freelancer;
        employer = _employer;
        amount = msg.value; // Set the amount to the value sent during the contract creation
    }

    function releaseFunds() external {
        require(msg.sender == employer, "Only the employer can release funds");
        require(amount > 0, "No funds to release");
        payable(freelancer).transfer(amount);
        amount = 0; // Set amount to 0 after release
    }

    function refund() external {
        require(msg.sender == freelancer, "Only the freelancer can request a refund");
        require(amount > 0, "No funds to refund");
        payable(freelancer).transfer(amount);
        amount = 0; // Set amount to 0 after refund
    }

    function releaseReducedFunds(uint _reducedAmount) external {
        require(msg.sender == employer, "Only the employer can release funds");
        require(amount > 0, "No funds to release");
        require(_reducedAmount <= amount, "Reduced amount exceeds escrow balance");

        payable(freelancer).transfer(_reducedAmount);
        amount -= _reducedAmount; // Deduct the paid amount from the total escrow balance
    }

    function releaseMilestonePayment(uint milestonePercentage, uint delayPenalty) external {
        // require(msg.sender == employer, "Only the employer can release milestone payments");
        require(amount > 0, "Insufficient funds in escrow");

        uint milestonePayment = (amount * milestonePercentage) / 100;
        uint reducedPayment = milestonePayment - ((milestonePayment * delayPenalty) / 100);

        require(reducedPayment <= amount, "Reduced payment exceeds escrow balance");

        payable(freelancer).transfer(reducedPayment);
        amount -= reducedPayment;
    }
}

contract RequestManager {
    Projects public projectsContract;

    enum RequestStatus { Pending, Accepted, Rejected }

    struct Request {
        uint projectId;
        address freelancer;
        uint freelancerRating;
        RequestStatus status;
        Escrow escrowContract;
    }

    // Store all requests in a single mapping
    mapping(uint => Request) public requests;
    uint public requestCount; // To keep track of the total number of requests

    event RequestSent(uint requestId, uint projectId, address freelancer);
    event RequestAccepted(uint requestId, address freelancer, address escrowContract);
    event RequestRejected(uint requestId, address freelancer);
    event MilestoneAccepted(uint projectId, uint milestoneId, uint updatedRating);

    constructor(address _projectsContract) {
        projectsContract = Projects(_projectsContract);
    }

    function sendRequest(uint _projectId, uint _freelancerRating) public {
        require(_projectId > 0 && _projectId <= projectsContract.projectCount(), "Invalid project ID");
        (,, , , Projects.Status status, ) = projectsContract.getProject(_projectId);
        require(status == Projects.Status.Open, "Project is not open");

        // Create a new request
        requestCount++; // Increment request count to create a unique ID
        requests[requestCount] = Request({
            projectId: _projectId,
            freelancer: msg.sender,
            freelancerRating: _freelancerRating,
            status: RequestStatus.Pending,
            escrowContract: Escrow(address(0))
        });

        emit RequestSent(requestCount, _projectId, msg.sender);
    }

    function acceptRequest(uint _requestId) public payable {
        Request storage request = requests[_requestId];
        require(request.freelancer != address(0), "No request exists for this ID");
        require(request.status == RequestStatus.Pending, "Request is not pending");

        // Fetch project details
        (,, , uint projectReward, Projects.Status status, address employer) = projectsContract.getProject(request.projectId);
        require(msg.sender == employer, "Only the employer can accept the request");
        require(status == Projects.Status.Open, "Project must be open");

        // Create new escrow contract instance with freelancer and employer details
        request.escrowContract = new Escrow{value: projectReward}(request.freelancer, employer);

        request.status = RequestStatus.Accepted;
        emit RequestAccepted(_requestId, request.freelancer, address(request.escrowContract));
    }

    function rejectRequest(uint _requestId) public {
        Request storage request = requests[_requestId];
        require(request.freelancer != address(0), "No request exists for this ID");
        require(request.status == RequestStatus.Pending, "Request already processed");

        request.status = RequestStatus.Rejected;
        emit RequestRejected(_requestId, request.freelancer);
    }

    function getRequest(uint _requestId) public view returns (Request memory) {
        require(requests[_requestId].freelancer != address(0), "No request exists for this ID");
        return requests[_requestId];
    }

    // New function to view all requests
    function viewAllRequests() public view returns (
        uint[] memory requestIds,
        uint[] memory projectIds,
        address[] memory freelancers,
        uint[] memory freelancerRatings,
        RequestStatus[] memory statuses,
        address[] memory escrowContracts
    ) {
        uint count = requestCount;

        // Initialize arrays based on the total request count
        requestIds = new uint[](count);
        projectIds = new uint[](count);
        freelancers = new address[](count);
        freelancerRatings = new uint[](count);
        statuses = new RequestStatus[](count);
        escrowContracts = new address[](count);

        // Populate the arrays with request details
        for (uint i = 1; i <= requestCount; i++) {
            Request storage request = requests[i];
            requestIds[i - 1] = i;
            projectIds[i - 1] = request.projectId;
            freelancers[i - 1] = request.freelancer;
            freelancerRatings[i - 1] = request.freelancerRating;
            statuses[i - 1] = request.status;
            escrowContracts[i - 1] = address(request.escrowContract);
        }

        return (requestIds, projectIds, freelancers, freelancerRatings, statuses, escrowContracts);
    }

/*
function acceptMilestone(uint _milestoneId, uint _actualDaysTaken, uint _delayPenalty, uint _requestId) public payable {
        Request memory request = getRequest(_requestId); // Retrieve the request using requestId

        // Ensure projectId is valid
        require(request.projectId > 0 && request.projectId <= projectsContract.projectCount(), "Project does not exist");

        // Retrieve the project details using the getProject function
        (, , , uint reward, , address employer) = projectsContract.getProject(request.projectId);
        require(msg.sender == employer, "Only the employer can accept milestones");

        // Ensure milestoneId is valid
        (
            uint[] memory ids,
            uint[] memory projectIds,
            string[] memory names,
            string[] memory descriptions,
            uint[] memory daycounts,
            uint[] memory percentages,
            bool[] memory completions,
            string[] memory proofFileHashes
        ) = projectsContract.getMilestones(request.projectId);

        // Check if the milestone exists and is within bounds
        require(_milestoneId > 0 && _milestoneId <= ids.length, "Milestone does not exist");
        
        // Fetch milestone data by using _milestoneId as an index
        uint milestoneIndex = _milestoneId - 1;
        require(!completions[milestoneIndex], "Milestone already completed");
        require(bytes(proofFileHashes[milestoneIndex]).length > 0, "Proof file not uploaded");

        // Mark the milestone as completed
        projectsContract.completeMilestone(request.projectId, _milestoneId);

        // Calculate and update freelancer rating based on the provided formula
        uint currentRating = projectsContract.getFreelancerRating(request.freelancer);
        uint rewardWeight = (percentages[milestoneIndex] * reward) / 100;
        int ratingChange = int((5 * 100 * rewardWeight * daycounts[milestoneIndex]) / (reward * _actualDaysTaken));

        // Cap the increment at +0.2 if positive
        if (ratingChange > 20) {
            ratingChange = 20;
        }

        uint newRating = uint(int(currentRating) + ratingChange);

        // Ensure new rating doesn't exceed 5.0 (500 basis points)
        if (newRating > 500) {
            newRating = 500;
        }

        // Update the freelancer's rating
        projectsContract.setFreelancerRating(request.freelancer, newRating);

        // Release milestone payment from the escrow with the specified penalty
        uint milestonePercentage = percentages[milestoneIndex];
        request.escrowContract.releaseMilestonePayment(milestonePercentage, _delayPenalty);

        emit MilestoneAccepted(request.projectId, _milestoneId, newRating);
    }
    */


    function viewRequestsByEmployer() public view returns (
            uint[] memory requestIds,
            uint[] memory projectIds,
            address[] memory freelancers,
            uint[] memory freelancerRatings,
            RequestStatus[] memory statuses,
            address[] memory escrowContracts
        ) {
            uint count = 0;

            // Count requests that belong to projects owned by the employer
            for (uint i = 1; i <= requestCount; i++) {
                uint projectId = requests[i].projectId;
                (, , , , , address employer) = projectsContract.getProject(projectId);
                if (employer == msg.sender) {
                    count++;
                }
            }

            // Initialize arrays based on the count of matching requests
            requestIds = new uint[](count);
            projectIds = new uint[](count);
            freelancers = new address[](count);
            freelancerRatings = new uint[](count);
            statuses = new RequestStatus[](count);
            escrowContracts = new address[](count);

            uint index = 0;

            // Populate the arrays with matching request details
            for (uint i = 1; i <= requestCount; i++) {
                uint projectId = requests[i].projectId;
                (, , , , , address employer) = projectsContract.getProject(projectId);
                if (employer == msg.sender) {
                    Request storage request = requests[i];
                    requestIds[index] = i;
                    projectIds[index] = request.projectId;
                    freelancers[index] = request.freelancer;
                    freelancerRatings[index] = request.freelancerRating;
                    statuses[index] = request.status;
                    escrowContracts[index] = address(request.escrowContract);
                    index++;
                }
            }

            return (requestIds, projectIds, freelancers, freelancerRatings, statuses, escrowContracts);
    }


}
