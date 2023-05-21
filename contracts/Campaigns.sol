// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory name, string memory description, string memory image, uint target) public {
        address newCampaign = address(new Campaign(minimum, msg.sender, name, description, image, target));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimunContribution;
    string public CampaignName;
    string public CampaignDescription;
    string public imageUrl;
    uint public targetToAchieve;
    mapping(address => bool) public approvers;
    uint public approversCount;
    bool public approved;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimun, address creator, string memory name, string memory description, string memory image, uint target) {
        manager = creator;
        minimunContribution = minimun;
        CampaignName = name;
        CampaignDescription = description;
        imageUrl = image;
        targetToAchieve = target;
    }

  function contribute() public payable {
  require(goalNotReached(), "Campaign goal already reached");
  require(msg.value > 0, "Contribution must be greater than 0");

    if (!approvers[msg.sender]) {
        approvers[msg.sender] = true;
        approversCount++;
    }
} 
function goalNotReached() public view returns (bool) {
  return address(this).balance <= targetToAchieve;
}

function setApproval(bool status) public {
    require(msg.sender == manager, "Only the manager can approve or reject the campaign");
    approved = status;
}

function isApproved() public view returns (bool) {
    return approved;
}

    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

  function approveRequest(uint index) public {
    require(approvers[msg.sender], "Sender not an approver");
    require(!requests[index].approvals[msg.sender], "Request already approved");

    requests[index].approvals[msg.sender] = true;
    requests[index].approvalCount++;
}


    function finalizeRequest(uint index) public restricted {
        require(requests[index].approvalCount > (approversCount / 2));
        require(!requests[index].complete);

        payable(requests[index].recipient).transfer(requests[index].value);
        requests[index].complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address, string memory, string memory, string memory, uint, bool) {
    return (
        minimunContribution,
        address(this).balance,
        requests.length,
        approversCount,
        manager,
        CampaignName,
        CampaignDescription,
        imageUrl,
        targetToAchieve,
        approved
    );
}


    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function approveCampaign(bool status) public restricted {
    approved = status;
}

}
