loadInitialData("sevenDays");
connectMe("metamask_wallet");
function connectWallet() {}

function openTab(event, name) {
    console.log(name);
    constructCall = name;
    getSelectedTab(name);
    loadInitialData(name);

}

async function loadInitialData(sClass) {
    console.log(sClass);
    try {
        clearInterval(countDownGlobal);

        let cObj = new web3Main.eth.Contract(
            SELECT_CONTRACT[_NETWORK_ID].STACKING.abi,
            SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address
        );

        //ID ELEMENT DATA
        let totalUsers = await cObj.methods.getTotalUsers().call();
        let cApy = await cObj.methods.getAPY().call();
        
        //GET USER
        let userDetail = await cObj.methods.getUser(currentAddress).call();
        
        const user = {
            lastRewardCalculationTime: userDetail.lastRewardCalculationTime,
            lastStakeTime: userDetail.lastStakeTime,
            rewardAmount: userDetail.rewardAmount,
            rewardClaimedSoFar: userDetail.rewardClaimedSoFar,
            stakeAmount: userDetail.stakeAmount,
            address: currentAddress,
        };

        localStorage.setItem("User", JSON.stringify(user));

        let userDetailBal = userDetail.stakeAmount / 10 ** 18;

        document.getElementById(
            "total-loked-user-token"
        ).innerHTML = `${userDetailBal}`;

        //ELEMENTS -- ID
        document.getElementById(
            "num-of-stackers-value"
        ).innerHTML = `${totalUsers}`;
        document.getElementById(
            "apy-value-feature"
        ).innerHTML = `${cApy} %`;


        //CLASS ELEMENT DATA
        let totalLokedTokens = await cObj.methods.getTotalStakedTokens().call();
        let earlyUnstakeFee = await cObj.methods.getEarlyUnstakeFeePercentage().call();

        //ELEMENT --CLASS
        document.getElementById("total-locked-tokens-value").innerHTML = `${
            totalLokedTokens / 10 ** 18
        } ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;

        document.querySelectorAll(".early-unstake-fee-value").forEach(function (element) {
            element.innerHTML = `${earlyUnstakeFee / 100}%`;
        });

        let minStakeAmount = await cObj.methods.getMinimumStakingAmount().call();
        minStakeAmount = Number(minStakeAmount);
        let minA;

        if (minStakeAmount) {
            minA = `${(minStakeAmount / 10 ** 18).toLocaleString()} ${
                SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
            }`;
        } else {
            minA = "N/A";
        }

        document.querySelectorAll(".Minimmum-Staking-Amount").forEach(function (element) {
            element.innerHTML = `${minA}`;
        });

        document.querySelectorAll(".Maximum-Staking-Amount").forEach(function(element) {
            element.innerHTML = `${(10000000).toLocaleString()} ${
                SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
            }`;
        });

        let isStakingPaused = await cObj.methods.getStakingStatus().call();
        let isStakingPausedText;

        let startDate = await cObj.methods.getStakeStartDate().call();
        startDate = Number(startDate) * 1000;

        let endDate = await cObj.methods.getStakeEndDate().call();
        endDate = Number(endDate) * 1000;

        let stakeDate = await cObj.methods.getStakeDays().call();

        let days = Math.floor(Number(stakeDays) / (3600 * 24));

        let daysDisplay = days > 0 ? days + (days == 1 ? " days, " : " days, ") : "";

        document.querySelectorAll(".Lock-period-value").forEach(function (element) {
            element.innerHTML = `${dayDisplay}`;
        });

        let rewardBal = await cObj.methods.getUserEstimatedRewards().call({ from: currentAddress });

        document.getElementById("user-reward-balance-value").value = `Reward: ${
            rewardBal / 10 ** 18
        } ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;

        //USER TOKEN BALANCE
        let balMainUser = currentAddress ? await oContractToken.methods.balanceOf(currentAddress).call() : "";

        balMainUser = Number(balMainUser) / 10 ** 18;

        document.getElementById(
            "user-token-balance"
        ).innerHTML = `Balance: ${balMainUser}`;

        let currentDate = new Date().getTime();

        if (isStakingPaused) {
            isStakingPausedText = "Paused";
        } else if (currentDate < startDate) {
            isStakingPausedText = "Locked";
        } else if (currentDate > endDate) {
            isStakingPausedText = "Ended";
        } else {
            isStakingPausedText = "Active";
        }

        document.querySelectorAll(".active-status-staking").forEach(function (element) {
            element.innerHTML = `${isStakingPausedText}`;
        });

        if (currentDate > stakeDate && currentDate < endDate) {
            const ele = document.getElementById("countdown-time-value");
            generateCountDown(ele, endDate);

            document.getElementById(
                "countdown-title-value"
            ).innerHTML = `Staking Ends In`;
        }

        if (currentDate < startDate) {
            const ele = document.getElementById("countdown-time-value");
            ganerateCountDown(ele, endDate);

            document.getElementById(
                "countdown-title-value"
            ).innerHTML = `Staking Starts In`;
        }

        document.querySelectorAll(".apy-value").forEach(function (element) {
            element.innerHTML = `${cApy} %`;
        });
    } catch (error) {
        console.log(error);
        notyf.error(
            `Unable to fetch data from ${SELECT_CONTRACT[_NETWORK_ID].network_name}!\n Please refresh this page.`
        );
    }
}


function generateCountDown(ele, claimDate) {
    clearInterval(countDownGlobal);
    // Set the data we're counting down to
    var countDownDate = new Date(claimDate).getTime();

    // Update the count down every 1 secound
    countDownGlobal = setInterval(function () {
        //Get today's date and time
        var now = new Date().getTime();

        //Find the Distance between now and the countdown date
        var distance = countDownDate - now;

        // Time calculation for days, hours, minutes and secounds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var secounds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result in the element with id="demo"
        ele.innerHTML = days + "d " + hours + "h " + minutes + "m " + secounds + "s "; 
        // ele.html(days + "d " + hours + "h " + minutes + "m " + secounds + "s "); 
        

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(countDownGlobal);
            ele.html("Refresh Page");
        }
    }, 1000);
}



async function connectMe(_provider) {
    try {
        let _comn_res = await commonProviderDetector(_provider);
        console.log(_comn_res);
        if (!_comn_res) {
            console.log("Please Connect");
        } else {
            let sClass = getSelectTab();
            console.log(sClass);
        }
    } catch (error) {
        notyf.error(error.message);
    }
}

async function stackTokens() {
    try {
        let nTokens = document.getElementById("amount-to-stake-value-new").value;

        if (!nTokens) {
            return;
        }

        if (isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0) {
            console.log(`Invalid token amount!`);
            return;
        }

        nTokens = Number(nTokens);

        let tokenToTransfer = addDecimal(nTokens, 18);

        console.log("tokenToTransfer", tokenToTransfer);

        let balMainUser = await oContractToken.methods.balanceOf(currentAddress).call();

        balMainUser = Number(balMainUser) / 10 ** 18;

        console.log("balMainUser", balMainUser);

        if (balMainUser < nTokens) {
            notyf.error(
                `insufficient tokens on ${SELECT_CONTRACT[_NETWORK_ID].network_name}.\nPlase buy some token first!`
            );
            return;
        }

        let sClass = getSelectTab(constructCall);

        console.log(sClass);
        let balMainAllowance = await oContractToken.methods.allowance(
            currentAddress, SELECT_CONTRACT[_NETWORK_ID].STAKING[sClass].address
        ).call();

        if (Number(balMainAllowance) < Number(tokenToTransfer)) {
            approveTokenSpend(tokenToTransfer, sClass);
        } else {
            stackTokenMain(tokenToTransfer, sClass);
        }
    } catch (error) {
        console.log(error);
        notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
}

async function approveTokenSpend(_mint_fee_wei, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractToken.methods.approve(
            SELECT_CONTRACT[_NETWORK_ID].STAKING[sClass].address, _mint_fee_wei
        ).estimateGas({
            from: currentAddress,
        });
    } catch (error) {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractToken.methods.approve(
        SELECT_CONTRACT[_NETWORK_ID].STAKING[sClass].address, _mint_fee_wei
    ).send({
        from: currentAddress,
        gas: gasEstimation,
    }).on("transactionHash", (hash) => {
        console.log("Transaction Hash: ", hash);
    }).on("receipt", (receipt) => {
        console.log(receipt);
        stackTokenMain(_mint_fee_wei);
    }).catch((error) => {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    });
}


async function stackTokenMain(_amount_wei, sClass) {
    let gasEstimation;

    let oContractStaking = getContractObj(sClass);

    try {
        gasEstimation = await oContractStaking.methods.stake(_amount_wei).estimateGas({
            from: currentAddress,
        });
    } catch (error) {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractStaking.methods.stake(_amount_wei).send({
        from: currentAddress,
        gas: gasEstimation,
    }).on("receipt", (receipt) => {
        console.log(receipt);
        const receiptObj = {
            token: _amount_wei,
            from: receipt.from,
            to: receipt.to,
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            cumulativeGasUsed: receipt.cumulativeGasUsed,
            effctiveGasPrise: receipt.effctiveGasPrise,
            gasUsed: receipt.gasUsed,
            status: receipt.status,
            transactionHash: receipt.transactionHash,
            type: receipt.type,
        };

        let transactionHistory = [];

        const allUserTransaction = localStorage.getItem("transaction");
        if (allUserTransaction) {
            transactionHistory = JSON.parse(localStorage.getItem("Transactions"));
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        } else {
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        }

        console.log(allUserTransaction);
        window.location.href = "https://127.0.0.1:5500/analytic.html";
    }).on("transactionHash", (hash) => {
        console.log("Transaction Hash: ", hash);
    })

    .catch((error) => {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    });

}

// async function unstakeTokens() {  // made modification here. may be it was spellind mistake.
async function unstackTokens() {
    try {
        let nTokens = document.getElementById("amount-to-unstake-valu").value;

        if (!nTokens) {
            return;
        }

        if (isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0) {
            notyf.log(`Invalid token amount!`);
            return;
        }

        nTokens = Number(nTokens);

        let tokenToTransfer = addDecimal(nTokens, 18);

        let sClass = getSelectTab(constructCall);
        let oContractStaking = getContractObj(sClass);

        let balMainUser = await oContractStaking.methods.getUser(currentAddress).call();

        balMainUser = Number(balMainUser.stakeAmount) / 10 ** 18;

        if (balMainUser < nTokens) {
            notyf.error(
                `insufficient stake tokens on ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`
            );
            return;    
        }

        unstackTokenMain(tokenToTransfer, oContractStaking, sClass);
    } catch (error) {
        console.log(error);
        notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
}


async function unstackTokenMain(_amount_wei, oContractStaking, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractStaking.methods.unstake(_amount_wei).estimateGas({
            from: currentAddress,
        });
    } catch (error) {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractStaking.methods.unstake(_amount_wei).send({
        from: currentAddress,
        gas: gasEstimation,
    }).on("receipt", (receipt) => {
        console.log(receipt);
        const receiptObj = {
            token: _amount_wei,
            from: receipt.from,
            to: receipt.to,
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            cumulativeGasUsed: receipt.cumulativeGasUsed,
            effctiveGasPrise: receipt.effctiveGasPrise,
            gasUsed: receipt.gasUsed,
            status: receipt.status,
            transactionHash: receipt.transactionHash,
            type: receipt.type,
        };

        let transactionHistory = [];

        const allUserTransaction = localStorage.getItem("Transaction");
        if (allUserTransaction) {
            transactionHistory = JSON.parse(localStorage.getItem("Transactions"));
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        } else {
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        }

        window.location.href = "https://127.0.0.1:5500/analytic.html";
    }).on("transactionHash", (hash) => {
        console.log("Transaction Hash: ", hash);
    })

    .catch((error) => {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    });

}

async function claimTokens() {
    try {
        let sClass = getSelectTab(constructCall);
        let oContractStaking = getContractObj(sClass);

        let rewardBal = await oContractStaking.methods.getUserEstimatedRewards().call({ from: currentAddress });

        rewardBal = Number(rewardBal);

        if (!wardBal) {
            notyf.dismiss(notification);
            notyf.error(`insufficient reward tokens to claim!`);
            return;    
        }

        claimTokenMain(oContractStaking, sClass);
    } catch (error) {
        console.log(error);
        notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
}


async function claimTokenMain(oContractStaking, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractStaking.methods.claimReward().estimateGas({
            from: currentAddress,
        });
        console.log("gasEstimation", gasEstimation);
    } catch (error) {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractStaking.methods.claimReward().send({
        from: currentAddress,
        gas: gasEstimation,
    }).on("receipt", (receipt) => {
        console.log(receipt);
        const receiptObj = {
            from: receipt.from,
            to: receipt.to,
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            cumulativeGasUsed: receipt.cumulativeGasUsed,
            effctiveGasPrise: receipt.effctiveGasPrise,
            gasUsed: receipt.gasUsed,
            status: receipt.status,
            transactionHash: receipt.transactionHash,
            type: receipt.type,
        };

        let transactionHistory = [];

        const allUserTransaction = localStorage.getItem("Transaction");
        if (allUserTransaction) {
            transactionHistory = JSON.parse(localStorage.getItem("Transactions"));
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        } else {
            transactionHistory.push(receiptObj);
            localStorage.setItem(
                "Transaction",
                JSON.stringify(transactionHistory) 
            );
        }

        window.location.href = "https://127.0.0.1:5500/analytic.html";
    }).on("transactionHash", (hash) => {
        console.log("Transaction Hash: ", hash);
    })

    .catch((error) => {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    });

}




