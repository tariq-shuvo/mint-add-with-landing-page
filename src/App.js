import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import './styles/style.css'
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 500px;
  @media (min-width: 767px) {
    width: 800px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    // CONTRACT_ADDRESS: "0x3aC0a1cbCc757077470ffC6B3dE00A0CfBF3BB36",
    CONTRACT_ADDRESS:"0xD677Ccd9B4da1cd902b413c5568428FF8E9fA2e1",
    SCAN_LINK: "https://etherscan.io/address/0xD677Ccd9B4da1cd902b413c5568428FF8E9fA2e1",
    NETWORK: {
      // NAME: "goerli",
      NAME :"Ethereum",
      SYMBOL: "ETH",
      // ID: 5
      ID:1
    },
    NFT_NAME: "Lil Baby Lazy Lions",
    SYMBOL: "LBLL",
    MAX_SUPPLY: 4444,
    WEI_COST: 20000000000000000,
    DISPLAY_COST: 0.02,
    GAS_LIMIT: 285000,
    MARKETPLACE: "opensea.io",
    MARKETPLACE_LINK: "https://opensea.io/collection/lilbabylazylion",
    SHOW_BACKGROUND: true,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
    .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const claimFreeNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(0);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    
    blockchain.smartContract.methods
    .mintFREE(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 2000) {
      newMintAmount = 2000;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  const first = (e) => {
    e.preventDefault();
    claimNFTs();
    getData();
  }
  const second = (e) => {
    e.preventDefault();
    claimFreeNFTs();
    getData();
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <>
      <nav className="navbar navbar-expand">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src="images/logo.png" alt="logo" className="w-100" />
          </a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">
                  <img src="/images/icon-1.svg" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <img src="/images/icon-2.svg" />
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  <img src="/images/icon-3.svg" />
                </a>
              </li>
            </ul>
            {blockchain.smartContract === null && (
              <button className="btn btn-light ml-3" onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}>Connect Wallet</button>
            )}

            {blockchain.errorMsg !== "" ? (
              <>
                <s.SpacerSmall />
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "red",
                  }}
                >
                  {blockchain.errorMsg}
                </s.TextDescription>
              </>
            ) : null}    
          </div>
        </div>
      </nav>
      <section className="banner sec-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-5">
              <div className="banner-left mx-auto">
                <h1 className="heading mb-0"><span>6666</span> PXMAYC</h1>
                <h2 className="secondary-heading mb-2">Ready to be unleashed</h2>
                <p className="text-white mb-3">
                  Pixel Mutant Apes have escaped the lab. Get ready, stealth
                  launch is inbound
                </p>
                <div className="mint-btn text-center">
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                
              </>
            ) : (
              <>
                {blockchain.account === "" || blockchain.smartContract === null ? (
                    <button className="btn btn-theme btn-outine-theme-primary text-theme btn-mint"
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Mint
                    </button>
                ) : (
                      <button className="btn btn-theme btn-outine-theme-primary text-theme btn-mint"
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          if(data.totalSupply >= 200){
                            claimNFTs();
                          }else{
                            claimFreeNFTs();
                          }
                          getData();
                        }}
                      >
                        {claimingNft ? "Busy" : "Buy"}
                      </button>
                )}
              </>
            )}
                </div>
              </div>
            </div>
            <div className="col-md-6 banner-right">
              <img
                src="images/pxmayc_gif.5b4e6578da8209f552d2.gif"
                alt="pxmayc gif"
                className="w-75"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="what-is py-5">
        <div className="container">
          <div className="media custom-media">
            <div className="media-image mr-4">
              <img src="images/what-is.png" className="w-100" alt="what is pxmayc" />
            </div>
            <div className="media-body pt-5">
              <h1 className="heading mb-3">What is pxMayc ?</h1>
              <p className="text-white">
                pxMAYC is a collection of 6666 unique and randomly generated
                Pixelated Mutant Apes, Our Vision is to create a welcoming and
                tight knit community for those within the NFT Space who cannot
                obtain Mutant Apes, but want to feel the inclusivity that the MAYC
                community offers Our plan is to dedicate 100% of our royalties
                into purchasing MAYC and fractionalizing them. In doing so we will
                provide the foundation for the pxMAYC DAO where all holders will
                have a vote deciding the future of pxMAYC. We are not affiliated
                with Bored Ape Yacht Club, but pxMAYC is a derivative of their
                Mutant Ape Yacht Club Collection. Commercial ownership rights are
                given to each unique pxMAYC NFT you own.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="roadmap py-5">
        <div className="container">
          <h1 className="text-uppercase heading text-white text-center">Roadmap</h1>
          <div className="phases text-center">
            <div className="phase mt-5">
              <h2 className="heading">
                Phase 1
                <span
                  ><img
                    src="images/loading.gif"
                    alt="loading"
                    className="loading-img"
                /></span>
              </h2>
              <ul className="phase-desc-list text-white">
                <li>-WEBSITE LIVE, STEALTH LAUNCH, MINTING LIVE.</li>
                <li>-EXCLUSIVE HOLDER RAFFLES AND GIVEAWAYS</li>
                <li>-COMMUNITY OUTREACH TO GROW PXMAYC COMMUNITY</li>
              </ul>
            </div>
            <div className="phase mt-5">
              <h2 className="heading">Phase 2</h2>
              <ul className="phase-desc-list text-white">
                <li>-LAUNCH OF $SERUM TOKEN</li>
                <li>
                  -WE'LL BE PUTTING A PERCENT OF MINT INTO THE COMMUNITY WALLET
                </li>
                <li>
                  -100% OF PXMAYC ROYALTIES TO PURCHASE AND FRACTIONALIZE MAYC
                </li>
                <li>
                  PXMAYC DAO WHERE HOLDERS WILL BE ABLE TO GOVERN AND VOTE ON THE
                  FUTURE OF PXMAYC
                </li>
              </ul>
            </div>
            <div className="phase mt-5">
              <h2 className="heading">Phase 3</h2>
              <ul className="phase-desc-list text-white">
                <li>
                  -BURN $SERUM TO CREATE SOMETHING THAT MIGHT “HEAL” YOUR PXMAYC
                </li>
                <li>-TBA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="roadmap faq py-5">
        <div className="container">
          <h1 className="text-uppercase heading text-white text-center">Faq</h1>
          <div className="phases text-center">
            <div className="phase mt-5">
              <h2 className="heading">Official Launch</h2>
              <p className="text-white">January Stealth Mint</p>
            </div>
            <div className="phase mt-4">
              <h2 className="heading">Mint Price</h2>
              <p className="text-white">
                First 1000 free, then each PXMAYC is .01 ETH
              </p>
            </div>
            <div className="phase mt-4">
              <h2 className="heading">Total Supply</h2>
              <p className="text-white">6666</p>
            </div>
            <div className="phase mt-4">
              <h2 className="heading">How many can I mint?</h2>
              <p className="text-white">10 per tx</p>
            </div>
            <div className="phase mt-4">
              <h2 className="heading">Reveal?</h2>
              <p className="text-white">
                All pxMAYC will be revealed 24 hours after mint sells out
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="roadmap team pt-5">
        <div className="container">
          <h1 className="text-uppercase heading text-white text-center mb-5">
            Meet The Team
          </h1>
          <div className="row">
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="team-item text-center">
                <img
                  src="images/pxdex.png"
                  alt="founder"
                  className="img-fluid w-75"
                />
                <h3 className="title mt-3">pxDex</h3>
                <p className="text-white">Founder</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="team-item text-center">
                <img
                  src="images/pxsouls.png"
                  alt="founder"
                  className="img-fluid w-75"
                />
                <h3 className="title mt-3">pxSouls</h3>
                <p className="text-white">Artist</p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-5">
              <div className="team-item text-center">
                <img
                  src="images/pxconcord.png"
                  alt="founder"
                  className="img-fluid w-75"
                />
                <h3 className="title mt-3">pxConcord</h3>
                <p className="text-white">Dev</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;


