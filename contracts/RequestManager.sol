// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Projects.sol";

contract Escrow {
    address public freelancer;
    address public employer;
    uint public amount;

    constructor(address _freelancer, address _employer, uint _amount) payable {
        freelancer = _freelancer;
        employer = _employer;
        amount = _amount;
    }

    function releaseFunds() external {
        require(msg.sender == employer, "Only the employer can release funds");
        payable(freelancer).transfer(amount);
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

    mapping(uint => Request) public requests;

    event RequestSent(uint projectId, address freelancer);
    event RequestAccepted(uint projectId, address freelancer, address escrowContract);
    event RequestRejected(uint projectId, address freelancer);

    constructor(address _projectsContract) {
        projectsContract = Projects(_projectsContract);
    }

    function sendRequest(uint _projectId, uint _freelancerRating) public {
        require(_projectId > 0 && _projectId <= projectsContract.projectCount(), "Invalid project ID");
        (,, , , Projects.Status status, ) = projectsContract.getProject(_projectId);
        require(status == Projects.Status.Open, "Project is not open");

        requests[_projectId] = Request({
            projectId: _projectId,
            freelancer: msg.sender,
            freelancerRating: _freelancerRating,
            status: RequestStatus.Pending,
            escrowContract: Escrow(address(0))
        });

        emit RequestSent(_projectId, msg.sender);
    }

    function acceptRequest(uint _projectId) public payable {
        require(requests[_projectId].freelancer != address(0), "No request exists for this project");
        require(requests[_projectId].status == RequestStatus.Pending, "Request already processed");

        (, , , uint reward, Projects.Status status, address employer) = projectsContract.getProject(_projectId);
        require(status == Projects.Status.Open, "Project must be open");
        require(msg.sender == employer, "Only the employer can accept this request");
        require(msg.value == reward, "Incorrect reward amount sent");

        // Create new escrow contract instance with freelancer and employer details
        Escrow escrow = new Escrow{value: reward}(requests[_projectId].freelancer, employer, reward);
        requests[_projectId].escrowContract = escrow;

        requests[_projectId].status = RequestStatus.Accepted;
        emit RequestAccepted(_projectId, requests[_projectId].freelancer, address(escrow));
    }

    function rejectRequest(uint _projectId) public {
        require(requests[_projectId].freelancer != address(0), "No request exists for this project");
        require(requests[_projectId].status == RequestStatus.Pending, "Request already processed");

        (, , , , Projects.Status status, address employer) = projectsContract.getProject(_projectId);
        require(status == Projects.Status.Open, "Project must be open");
        require(msg.sender == employer, "Only the employer can reject this request");

        requests[_projectId].status = RequestStatus.Rejected;
        emit RequestRejected(_projectId, requests[_projectId].freelancer);
    }

    function getRequest(uint _projectId) public view returns (Request memory) {
        return requests[_projectId];
    }
}
