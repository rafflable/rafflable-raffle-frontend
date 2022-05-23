import React from 'react';
import Layout from '@/modules/layout';
import {
  Button,
  CardGroup,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
  Col,
  Container,
  Progress,
  Row,
} from 'reactstrap';
import { PolarRadiusAxis, RadialBarChart, RadialBar } from 'recharts';
import RiseLoader from 'react-spinners/RiseLoader';
import PropagateLoader from 'react-spinners/PropagateLoader';
import RangeSlider from 'react-bootstrap-range-slider';
import ReactPaginate from 'react-paginate';
import { PageDialog } from '@/ui/dialogs';

import useDialog from '@/hooks/useDialog';
import useRaffleConfig from '@/hooks/useRaffleConfig';
import useKRC20 from '@/hooks/useKRC20';
import useRafflable from '@/hooks/useRafflable';
import useRaffler from '@/hooks/useRaffler';
import useKardiachain from '@/hooks/useKardiachain';
import constants from '@/constants';

// icons
import { TiTicket } from 'react-icons/ti';

const DashHead = () => (
    <div className="view-header d-flex align-items-center">
    </div>
);

const ClaimContent = () => {
  const [loading, setLoading] = React.useState(false);
  const [ownerBalanceOf, setOwnerBalanceOf] = React.useState(0);
  const [ownerTickets, setOwnerTickets] = React.useState([]);
  const [prize, setPrize] = React.useState(0);
  const [claimables, setClaimables] = React.useState([]);
  const [error, setError] = React.useState(false);

  const { setClaimDialogOpen } = useDialog();
  const { account } = useKardiachain();
  const { readRafflable } = useRafflable();
  const { readRaffler, claim } = useRaffler();
  const { raffleConfig } = useRaffleConfig();
  const BigNumber = require('bignumber.js');

  React.useEffect(() => {
    const interval = setInterval(() => {
        if (account) {
          readRafflable(raffleConfig.rafflableAddress, 'balanceOf', [account]).then((val) => {
            setOwnerBalanceOf(val);
            const tickets = [];
            while (--val >= 0) {
              tickets.push(readRafflable(raffleConfig.rafflableAddress, 'tokenOfOwnerByIndex', [account, val]))
            }
            Promise.all(tickets).then((values) => {
              setOwnerTickets(values);
            })
          })
        } else {
          setOwnerBalanceOf(0);
          setOwnerTickets([]);
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [account]);

  React.useEffect(() => {
    readRaffler(raffleConfig.rafflerAddress, 'claimable').then((val) => {
      setClaimables(val.filter(ticket => ownerTickets.includes(ticket)));
      if (claimables.length > 0) {
        readRaffler(raffleConfig.rafflerAddress, 'withdrawableBalance', [claimables[0], raffleConfig.config.tokenAddress]).then((val) => {
          setPrize(val);
        });
      }
    });
  }, [ownerTickets]);

  const withDecimals = (val) => {
    if (val) {
      return new BigNumber(val).shiftedBy(-Math.abs(raffleConfig.config.tokenDecimals)).toString();
    }
  }

  return (
    <Card className="mb-5">
      {prize > 0 ?
      <>
        <CardBody>
          <CardTitle className="">You have won a prize!</CardTitle>
        </CardBody>
        <CardFooter>
          <div className="w-100 text-center">
            <h1>{withDecimals(prize)} {raffleConfig.config.tokenSymbol}</h1>
          </div>
        </CardFooter>
      </>
      : <CardBody>
          <CardTitle>You have no prize yet.</CardTitle>
        </CardBody>
      }
      <Button color="primary" className="mx-2 mt-4" style={{ height: '4em' }} disabled={claimables.length > 0 ? false : true}
        onClick={() => { setError(false); setLoading(true); claim(raffleConfig.rafflerAddress, account, claimables[0]).then((tx) => { setLoading(false); setClaimDialogOpen(false); }).catch((err) => { setLoading(false); setError(true); }) } }
        >
          <PropagateLoader loading={loading} color="#fff" size={10} />
          {loading ? '' : 'Claim'}
      </Button>
      {error ?
        <div className="text-right m-3" style={{ color: '#dc2626' }}>
          An error occured.
        </div>
      : ''}
    </Card>
  );
}

const BuyContent = () => {
  const [loading, setLoading] = React.useState(false);
  const [amount, setAmount] = React.useState(1);
  const [approved, setApproved] = React.useState(false);
  const [hasFund, setHasFund] = React.useState(false);
  const [error, setError] = React.useState(false);

  const { setBuyDialogOpen } = useDialog();
  const { account } = useKardiachain();
  const { approve, readKRC20 } = useKRC20();
  const { mint } = useRafflable();
  const { raffleConfig } = useRaffleConfig();
  const BigNumber = require('bignumber.js');

  React.useEffect(() => {
    if (account) {
      readKRC20(raffleConfig.config.tokenAddress, 'allowance', [account, raffleConfig.rafflableAddress]).then((val) => {
        const allowance = new BigNumber(val);
        const ticketCost = new BigNumber(raffleConfig.initialValues.ticketCost);
        setApproved(allowance.isGreaterThanOrEqualTo(ticketCost.multipliedBy(amount)));
      })
    }
  }, [amount, account])

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (account) {
        readKRC20(raffleConfig.config.tokenAddress, 'balanceOf', [account]).then((val) => {
        const bal = new BigNumber(val);
        const ticketCost = new BigNumber(raffleConfig.initialValues.ticketCost);
        setHasFund(bal.isGreaterThanOrEqualTo(ticketCost.multipliedBy(amount)));
        })
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [account]);

  const withDecimalsAndAmount = (val) => {
    if (val) {
      return new BigNumber(val).multipliedBy(amount).shiftedBy(-Math.abs(raffleConfig.config.tokenDecimals)).toString();
    }
  }

  return (
    <Card className="mb-5">
      <CardBody>
        <CardTitle>Select the quantity to buy</CardTitle>
        <RangeSlider
          min={1}
          max={5}
          value={amount}
          onChange={ changeEvent => setAmount(changeEvent.target.value)}
          className="w-100"
          tooltip="off"
        />
      <div className="w-100 text-right">
        {amount} ticket{amount > 1 ? 's' : ''}
      </div>
      </CardBody>
      <CardFooter>
        You will pay&nbsp;
        {withDecimalsAndAmount(raffleConfig.initialValues.ticketCost)}&nbsp;
        {raffleConfig.config.tokenSymbol}
      </CardFooter>
      {approved ?
        <Button color="primary" className="mx-2 mt-4" style={{ height: '4em' }} disabled={!hasFund}
          onClick={() => { setError(false); setLoading(true); mint(raffleConfig.rafflableAddress, account, amount).then((tx) => { setLoading(false); setBuyDialogOpen(false); }).catch((err) => { console.log(err); setLoading(false); setError(true); }) } }
        >
          <PropagateLoader loading={loading} color="#fff" size={10} />
          {loading ? '' : 'Buy'}
        </Button>
      :
        <Button color="primary" className="mx-2 mt-4" style={{ height: '4em' }} disabled={!hasFund}
          onClick={() => { setError(false); setLoading(true); approve(raffleConfig.config.tokenAddress, raffleConfig.rafflableAddress, account, new BigNumber(raffleConfig.initialValues.ticketCost).multipliedBy(amount).toString()).then((tx) => { setApproved(true); setLoading(false); }).catch((err) => { setLoading(false); setError(true); }) } }
        >
          <PropagateLoader loading={loading} color="#fff" size={10} />
          {loading ? '' : 'Approve'}
        </Button>
      }
      {!hasFund ?
        <div className="text-right m-3" style={{ color: '#dc2626' }}>
          Insufficient fund in your wallet.
        </div>
      : ''}
      {error ?
        <div className="text-right m-3" style={{ color: '#dc2626' }}>
          An error occured.
        </div>
      : ''}
    </Card>
  );
}

const DashContent = () => {
  const [ownerBalanceOf, setOwnerBalanceOf] = React.useState(0);
  const [ownerTickets, setOwnerTickets] = React.useState([]);
  const [prizeBalance, setPrizeBalance] = React.useState(0);
  const [prizeTarget, setPrizeTarget] = React.useState(0);
  const [prizePercent, setPrizePercent] = React.useState(0);
  const [hat, setHat] = React.useState([]);
  const [hatShowTickets, setHatShowTickets] = React.useState([]);
  const [hatPageCount, setHatPageCount] = React.useState(0);
  const [hatTicketOffset, setHatTicketOffset] = React.useState(null);
  const [ticketSupply, setTicketSupply] = React.useState(0);
  const [config, setConfig] = React.useState({});

  const { raffleConfig } = useRaffleConfig()
  const { account, library } = useKardiachain();
  const { readKRC20 } = useKRC20();
  const { readRaffler } = useRaffler();
  const { readRafflable } = useRafflable();

  const { setBuyDialogOpen } = useDialog();

  const BigNumber = require('bignumber.js');

  const ticketsPerPage = 12;

  React.useEffect(() => {
    const endOffset = hatTicketOffset + ticketsPerPage;
    setHatShowTickets(hat.slice(hatTicketOffset, endOffset));
    setHatPageCount(Math.ceil(hat.length / ticketsPerPage));
  }, [hatTicketOffset, hat]);

  const handleHatPageClick = (event) => {
    const newOffset = (event.selected * ticketsPerPage) % hat.length;
    setHatTicketOffset(newOffset);
  };

  React.useEffect(() => {
    if (raffleConfig && raffleConfig.loaded) {
      setPrizeBalance(raffleConfig.initialValues.prizeBalance);
      setPrizeTarget(raffleConfig.initialValues.prizeTarget);
      const percent = new BigNumber(raffleConfig.initialValues.prizeBalance)
        .dividedBy(raffleConfig.initialValues.prizeTarget).multipliedBy(100);
      setPrizePercent(percent.toFixed(0));

      setHat(raffleConfig.initialValues.hat.sort((a,b) => { return a - b; }));
      setHatTicketOffset(0);
      setTicketSupply(raffleConfig.initialValues.ticketSupply);

      const config = raffleConfig.config;
      config.createdAt = new Date(raffleConfig.createdAt).toString();
      config.ticketCost = raffleConfig.initialValues.ticketCost;
      config.ticketCap = raffleConfig.initialValues.ticketCap;
      setConfig(raffleConfig.config);
    }
  }, [raffleConfig.loaded]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (config.tokenAddress) {
        readRaffler(raffleConfig.rafflerAddress, 'prizeOf', [config.tokenAddress]).then((val) => {
          setPrizeBalance(val);
          const percent = new BigNumber(val).dividedBy(prizeTarget).multipliedBy(100);
          setPrizePercent(percent.toFixed(0));
        });
        readRaffler(raffleConfig.rafflerAddress, 'hat').then((val) => {
          setHat(val.sort((a,b) => { return a - b; }));
        });
        readRafflable(raffleConfig.rafflableAddress, 'totalSupply').then((val) => {
          setTicketSupply(val);
        });

        if (account) {
          readRafflable(raffleConfig.rafflableAddress, 'balanceOf', [account]).then((val) => {
            setOwnerBalanceOf(val);
            const tickets = [];
            while (--val >= 0) {
              tickets.push(readRafflable(raffleConfig.rafflableAddress, 'tokenOfOwnerByIndex', [account, val]))
            }
            Promise.all(tickets).then((values) => {
              setOwnerTickets(values);
            })
          })
        } else {
          setOwnerBalanceOf(0);
          setOwnerTickets([]);
        }
      }
    }, constants.dashboardRefreshInterval);
    return () => clearInterval(interval);
  }, [account, config]);

  const withDecimals = (val) => {
    if (val) {
      return new BigNumber(val).shiftedBy(-Math.abs(config.tokenDecimals)).toString();
    }
  }

  return (
    <div className="view-content view-dashboard">
      <Row>
        <div className="dashboard-left col-md-12 col-lg-7 d-flex-col align-items-stretch">
          <Row>
            <img style={{ objectFit: 'scale-down' }} src={config.banner} />
          </Row>
          <Row>
            <CardGroup className="ticket-card">
              <div style={{ flex: '2 0 0' }}>
                <CardBody>
                  <CardTitle className="text-uppercase h6">{config.title}</CardTitle>
                  <div className="small mb-4 card-subtitle">
                    Created on {config.createdAt}
                  </div>

                  <div>
                    {config.description}
                    <br />
                  </div>
                </CardBody>
              </div>
              <Card>
                <CardBody>
                  <h6 className="text-uppercase title font-weight-bold small">Ticket sales</h6>
                  <Progress value={ticketSupply} max={config.ticketCap} className="w-100 my-3" />
                  <div className="small mb-4 card-subtitle text-right">
                    {ticketSupply} of {config.ticketCap} ({
                      config.ticketCap > 0 ? (ticketSupply / config.ticketCap * 100).toFixed(1) : '0'
                    }%)
                  </div>
                </CardBody>
                <CardBody>
                  <h6 className="text-uppercase title font-weight-bold small">Ticket costs</h6>
                  <h5 className="font-weight-normal mb-0 text-nowrap">
                    {withDecimals(config.ticketCost)} {config.tokenSymbol}
                  </h5>
                </CardBody>
              </Card>
            </CardGroup>
          </Row>

          <Row>
            <Card>
              <CardBody>
                <div className="d-flex flex-row justify-content-between">
                  <CardTitle className="text-uppercase h6">
                    Your tickets&nbsp;({ownerBalanceOf})
                  </CardTitle>
                  <Button color="primary" onClick={() => { setBuyDialogOpen(true); } }>
                    Buy tickets
                  </Button>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center col-12">
                  <RiseLoader
                    loading={ownerBalanceOf > 0 && (ownerBalanceOf != ownerTickets.length)}
                    css="display: block; margin: 50px 0;"
                  />
                </div>
              </CardBody>
                <Row className="mt-5 mb-5 mx-2"
                  style={{ display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {ownerBalanceOf == ownerTickets.length ? ownerTickets.sort((a, b) => { return a - b }).map((ticketNumber) =>
                  {
                    return (
                        <div key={`owner-ticket-${ticketNumber}`}
                          style={{ display: 'inline-block' }}
                          className="p-2 col-12 col-sm-6 col-xl-4 text-wrap">
                          <Card className="text-center align-items-center">
                            <img style={{ objectFit: 'scale-down' }} src={config.banner} />
                            <h5 className="p-2">{config.title} #{ticketNumber}</h5>
                          </Card>
                        </div>
                    );
                  }
                ) : ''}
                </Row>
                {ownerBalanceOf == 0 ?
                  <div className="text-center p-5" style={{ marginTop: '-50px' }}>
                    You do not have any ticket in your wallet.
                  </div>
                : '' }
            </Card>
          </Row>

        </div>

        <div className="dashboard-right col-md-12 col-lg-5 d-flex-col align-items-stretch">
          <CardBody>
            <CardTitle className="h6 text-uppercase">Draw</CardTitle>
            <div className="small mb-4 card-subtitle">
              This draw will occur when the prize balance has reached the prize target.
            </div>
          </CardBody>

          <Row className="justify-content-center mt-5">
            <Col>
              <Row style={{ marginTop: '-50px' }} className="mb-5">
                <Col className="jusify-content-center">
                  <CardBody>
                    <h6 className="text-uppercase title font-weight-bold small">Prize balance</h6>
                    <h5 className="font-weight-normal mb-0 text-nowrap">
                      {withDecimals(prizeBalance)} {config.tokenSymbol}
                    </h5>
                  </CardBody>
                </Col>
                <Col>
                  <CardBody>
                    <h6 className="text-uppercase title font-weight-bold small">Prize target</h6>
                    <h5 className="font-weight-normal mb-0 text-nowrap">
                      {withDecimals(prizeTarget)} {config.tokenSymbol}
                    </h5>
                  </CardBody>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-center mb-5" style={{ paddingBottom: '200px' }}>
            <Col style={{ maxWidth: '220px' }}>
              <Row className="justify-content-center">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle text-white"
                  style={{ height: '130px', width: '130px', background: '#064e3b', zIndex: 5 }}>
                  <h2 className="font-weight-bold">
                    {prizePercent}%
                  </h2>
                </div>
              </Row>

              <Row
                className="justify-content-center"
                style={{ marginTop: '-215px', height: '0px' }}>
                <RadialBarChart
                  height={300}
                  width={300}
                  innerRadius="25%"
                  cx="50%"
                  cy="50%"
                  startAngle={360}
                  endAngle={0}
                  barSize={10}
                  data={[
                    { value: parseFloat(withDecimals(prizeTarget)), fill: '#064e3b' },
                    { value: parseFloat(withDecimals(prizeBalance)), fill: '#047857' },
                  ]}>
                  <RadialBar minAngle={15} background dataKey="value" />
                </RadialBarChart>
              </Row>

            </Col>
          </Row>
          <Row>
            <div>
              <CardBody>
                <CardTitle className="h6 text-uppercase">The hat&nbsp;({hat.length})</CardTitle>
                <div className="small mb-4 card-subtitle">
                  A winner will be picked from this hat on the next draw.
                </div>
                <div>
                  <Row className="justify-content-center">
                  {hatShowTickets.map((ticketNumber, i) =>
                    {
                      return (
                        <div key={`hat-ticket-${ticketNumber}`} className="p-2">
                          <div className="text-center" style={{ width: '128px', height: '128px' }}>
                            <Col className="pt-4">
                              <TiTicket size="80"
                                color={ownerTickets.includes(ticketNumber) ? "#eab308" : "#cacaca" }
                                className="mb-2"
                              />
                              <h2 style={{ marginTop: '-60px', marginLeft: '-10px' }}>#{ticketNumber}</h2>
                            </Col>
                          </div>
                        </div>
                      )
                    })
                  }
                  </Row>
                  <Row className="justify-content-center">
                    <ReactPaginate
                      breakLabel="..."
                      breakClassName='page-item'
                      breakLinkClassName='page-link'
                      containerClassName='pagination'
                      pageClassName='page-item'
                      pageLinkClassName='page-link'
                      previousClassName='page-item'
                      previousLinkClassName='page-link'
                      nextClassName='page-item'
                      nextLinkClassName='page-link'
                      activeClassName='active'
                      nextLabel=">"
                      onPageChange={handleHatPageClick}
                      pageRangeDisplayed={5}
                      pageCount={hatPageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                    />
                  </Row>
                </div>
              </CardBody>
            </div>
          </Row>
        </div>
      </Row>
    </div>
  );
};

export default function Dashboard() {
  const { isBuyDialogOpen, setBuyDialogOpen } = useDialog();
  const { isClaimDialogOpen, setClaimDialogOpen } = useDialog();

  return (
    <Layout>
      <PageDialog isOpen={isBuyDialogOpen} setOpen={setBuyDialogOpen}>
        <BuyContent />
      </PageDialog>
      <PageDialog isOpen={isClaimDialogOpen} setOpen={setClaimDialogOpen}>
        <ClaimContent />
      </PageDialog>
      <DashHead />
      <DashContent />
    </Layout>
  );
}
