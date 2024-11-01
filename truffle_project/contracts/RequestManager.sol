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
}
