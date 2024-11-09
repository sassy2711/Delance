// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

contract Projects {
    
    enum Status { Closed, Open }

    struct Project {
        uint id;
        string name;
        string description;
        uint reward;
        Status status;
        address employer;
    }

    struct Milestone {
        uint id;
        uint projectId;
        string name;
        string description;
        uint daycount;
        uint percentage;
        bool completed;
    }

    mapping(uint => Project) public projects;
    mapping(uint => Milestone[]) public milestones;

    uint public projectCount;
    uint public milestoneCount;

    event ProjectAdded(uint id, string name, address employer);
    event MilestoneAdded(uint projectId, uint milestoneId, string name, uint percentage);

    function addProject(string memory _name, string memory _description, uint _reward) public {
        projectCount++;
        projects[projectCount] = Project({
            id: projectCount,
            name: _name,
            description: _description,
            reward: _reward,
            status: Status.Open,
            employer: msg.sender
        });

        emit ProjectAdded(projectCount, _name, msg.sender);
    }

    function addMilestone(uint _projectId, string memory _name, string memory _description, uint _daycount, uint _percentage) public {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        require(msg.sender == projects[_projectId].employer, "Only the employer can add milestones");
        require(_percentage > 0 && _percentage <= 100, "Invalid percentage");

        milestoneCount++;
        milestones[_projectId].push(Milestone({
            id: milestoneCount,
            projectId: _projectId,
            name: _name,
            description: _description,
            daycount: _daycount,
            percentage: _percentage,
            completed: false
        }));

        emit MilestoneAdded(_projectId, milestoneCount, _name, _percentage);
    }

    function getProject(uint _id) public view returns (uint, string memory, string memory, uint, Status, address) {
        require(_id > 0 && _id <= projectCount, "Project does not exist");
        Project memory proj = projects[_id];
        return (proj.id, proj.name, proj.description, proj.reward, proj.status, proj.employer);
    }

    function viewProjects() public view returns (
        uint[] memory ids, 
        string[] memory names, 
        string[] memory descriptions, 
        uint[] memory rewards, 
        Status[] memory statuses, 
        address[] memory employers
    ) {
        ids = new uint[](projectCount);
        names = new string[](projectCount);
        descriptions = new string[](projectCount);
        rewards = new uint[](projectCount);
        statuses = new Status[](projectCount);
        employers = new address[](projectCount);

        for (uint i = 1; i <= projectCount; i++) {
            Project storage proj = projects[i];
            ids[i - 1] = proj.id;
            names[i - 1] = proj.name;
            descriptions[i - 1] = proj.description;
            rewards[i - 1] = proj.reward;
            statuses[i - 1] = proj.status;
            employers[i - 1] = proj.employer;
        }

        return (ids, names, descriptions, rewards, statuses, employers);
    }

    function viewOpenProjects() public view returns (
        uint[] memory ids, 
        string[] memory names, 
        string[] memory descriptions, 
        uint[] memory rewards, 
        Status[] memory statuses, 
        address[] memory employers
    ) {
        uint openCount = 0;
        for (uint i = 1; i <= projectCount; i++) {
            if (projects[i].status == Status.Open) {
                openCount++;
            }
        }

        ids = new uint[](openCount);
        names = new string[](openCount);
        descriptions = new string[](openCount);
        rewards = new uint[](openCount);
        statuses = new Status[](openCount);
        employers = new address[](openCount);

        uint index = 0;
        for (uint i = 1; i <= projectCount; i++) {
            if (projects[i].status == Status.Open) {
                Project storage proj = projects[i];
                ids[index] = proj.id;
                names[index] = proj.name;
                descriptions[index] = proj.description;
                rewards[index] = proj.reward;
                statuses[index] = proj.status;
                employers[index] = proj.employer;
                index++;
            }
        }

        return (ids, names, descriptions, rewards, statuses, employers);
    }

function getMilestones(uint _projectId) public view returns (
    uint[] memory ids,
    string[] memory names,
    string[] memory descriptions,
    uint[] memory daycounts,
    uint[] memory percentages,
    bool[] memory completions
) {
    require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
    uint milestoneLength = milestones[_projectId].length;

    ids = new uint[](milestoneLength);
    names = new string[](milestoneLength);
    descriptions = new string[](milestoneLength);
    daycounts = new uint[](milestoneLength);
    percentages = new uint[](milestoneLength);
    completions = new bool[](milestoneLength);

    for (uint i = 0; i < milestoneLength; i++) {
        Milestone storage milestone = milestones[_projectId][i];
        ids[i] = milestone.id;
        names[i] = milestone.name;
        descriptions[i] = milestone.description;
        daycounts[i] = milestone.daycount;
        percentages[i] = milestone.percentage;
        completions[i] = milestone.completed;
    }
}


    function closeProject(uint _id) public {
        require(_id > 0 && _id <= projectCount, "Project does not exist");
        Project storage proj = projects[_id];
        require(msg.sender == proj.employer, "Only the employer can close this project");
        proj.status = Status.Closed;
    }

    function completeMilestone(uint _projectId, uint _milestoneId) public {
        require(_projectId > 0 && _projectId <= projectCount, "Project does not exist");
        require(msg.sender == projects[_projectId].employer, "Only the employer can mark milestones as completed");

        Milestone[] storage projectMilestones = milestones[_projectId];
        bool found = false;

        for (uint i = 0; i < projectMilestones.length; i++) {
            if (projectMilestones[i].id == _milestoneId) {
                projectMilestones[i].completed = true;
                found = true;
                break;
            }
        }

        require(found, "Milestone does not exist in this project");
    }
}
