import * as React from 'react'
import favicon from './@assets/images/fav.png'
import Footer from './@components/footer'
import Head from 'next/head'
import Header from './@components/header'
import styles from './index.module.scss'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { providers } from 'ethers'
import { useCallback, useEffect, useReducer, useState } from 'react'
import Lotus from './@assets/images/lotus.svg'
import { getEnsName } from '../util/ens'

const INFURA_KEY = process.env.INFURA_KEY

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_KEY,
    },
  },
}

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions,
  })
}

type StateType = {
  signature?: string | null
  address?: string | null
}

type ActionType =
  | {
      type: 'SET_SIGNATURE'
      signature?: string
      address?: string
    }
  | {
      type: 'RESET'
    }

const initialState: StateType = {
  signature: null,
  address: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_SIGNATURE':
      return {
        ...state,
        signature: action.signature,
        address: action.address,
      }
    case 'RESET':
      return initialState

    default:
      throw new Error()
  }
}

const Address: React.FunctionComponent<{ address: string }> = ({
  address,
}: {
  address: string
}) => {
  const [ensName, setEnsName] = useState<string | null>(null)

  useEffect(() => {
    getEnsName(address).then((name) => {
      if (name) {
        setEnsName(name.name)
      } else {
        setEnsName(address)
      }
    })
  }, [address])

  return <>{ensName}</>
}

export const Home = (): JSX.Element => {
  const [signers, setSigners] = useState<any[]>()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { signature, address } = state

  const onFetchSigners = useCallback(async () => {
    const response = await fetch(`/api/signers`)
    const data = await response.json()
    setSigners(data)
  }, [])

  const onAddSigner = useCallback(
    async (addr, signature) => {
      const ensName = await getEnsName(addr)
      await fetch(`/api/signers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: addr,
          signature,
          ens: ensName ? ensName.name : null,
        }),
      }).then(
        (response) => {
          if (response.status === 200) {
            onFetchSigners()
          }
        },
        // eslint-disable-next-line no-console
        (error) => console.log('An error occurred.', error)
      )
    },
    [onFetchSigners]
  )

  useEffect(() => {
    if (!signers) {
      onFetchSigners()
    }
  }, [signers, onFetchSigners])

  const signLetter = useCallback(
    async function () {
      const provider = await web3Modal.connect().catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Could not get a wallet connection', error)
        return
      })

      if (!provider) {
        dispatch({ type: 'RESET' })
        return
      }

      const web3Provider = new providers.Web3Provider(provider)

      const signer = web3Provider.getSigner()
      const addr = await signer.getAddress()

      const sign = await signer
        .signMessage(
          'I support wellbeing in web3 and today sign the open letter by moments of space'
        )
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Could not sign message', error)
          return
        })

      if (!sign) {
        dispatch({ type: 'RESET' })
        return
      }

      onAddSigner(addr, sign)

      dispatch({
        type: 'SET_SIGNATURE',
        signature: sign,
        address: addr,
      })

      // set cookies for signature and address
      document.cookie = `signature=${sign}`
      document.cookie = `address=${addr}`
    },
    [onAddSigner]
  )

  const onSignatureInCookies = useCallback(() => {
    const cookies = document.cookie.split(';')
    const signatureCookie = cookies.find((cookie) =>
      cookie.includes('signature')
    )
    const addressCookie = cookies.find((cookie) => cookie.includes('address'))
    if (signatureCookie && addressCookie) {
      const signature = signatureCookie.split('=')[1]
      const address = addressCookie.split('=')[1]
      dispatch({
        type: 'SET_SIGNATURE',
        signature,
        address,
      })
      return true
    }
    return false
  }, [])

  useEffect(() => {
    if (web3Modal.cachedProvider && !signature) {
      if (!onSignatureInCookies()) {
        signLetter()
      }
    }
  }, [signLetter, signature, onSignatureInCookies])

  return (
    <>
      <Head>
        <title>Moments of Space - Open Letter</title>
        <link rel="icon" href={favicon.src} />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 mt-16">
        <h1 className={styles.title}>Open Letter</h1>
        <h2 className={styles.subtitle}>A commitment to wellbeing in web3</h2>
        <img src={Lotus.src} alt="Lotus" className={styles.lotus} />
        <p className={styles.paragraphCentered}>
          Energy, excitement, potential, opportunity, collaboration, reward.
          Overwhelm, FOMO, anxiety, burnout, loneliness, loss.
        </p>

        <p className={styles.paragraphCentered}>
          Web3 gives us so much, but its fast pace, high stakes and
          unpredictability can also leave us exhausted, vulnerable and unhappy.
        </p>

        <p className={styles.paragraphCentered}>
          Community is the lifeblood of web3, so no matter who we are, where
          we’re from, or what we do, let’s unite to support and improve the
          wellbeing of us all.
        </p>
        <p className={styles.paragraphCentered}>
          Please join us in a pledge to take better care of our individual and
          collective minds, by signing with your wallet.
        </p>

        <div className={styles.letter}>
          <h4 className={styles.miniHeader}>Moments of Space Vision</h4>
          <p className={styles.paragraph}>
            Our vision is to harness the power of meditation, web3 and community
            in order to support wellbeing and inspire positive change.
          </p>

          <p className={styles.paragraph}>
            At the heart of it, we’re all united by the same core desires: to
            seek deeper connection, to enhance our physical and mental
            wellbeing, to activate our fullest potential, and to unlock new ways
            for us all to lead better lives.
          </p>

          <p className={styles.paragraph}>
            <b>
              When we combine meditation with mechanisms that inspire
              connection, growth and giving, we enable new ways to reconnect to
              ourselves and each other, so we can positively impact how we shape
              and show up in all our communities, however far they span.
            </b>
          </p>

          <p className={styles.paragraph}>
            Our iOS meditation app launched this year, and we’re building new
            ways to reward positive actions that support the growth of the
            individual, their communities and the world around us.
          </p>

          <p className={styles.paragraph}>
            We’re encouraging habit-building, wellbeing and giving, including
            Twinned Dynamic NFTs (dNFTs) that evolve as your meditation journey
            progresses, with a Twinned dNFT that is given to a community member
            who may find meditation platform subscriptions inaccessible due to
            cost.
          </p>
          <p className={styles.paragraph}>
            The evolution of your dNFT will act as your key to accessing
            financial or non-financial rewards, which can be kept or donated in
            line with your individual needs.
          </p>
          <p className={styles.paragraph}>
            Organisations, both in and out of web3, will be able to mint a dNFT
            that their community members can link to which generates dynamically
            to display the mental wellness state of their community, as well as
            the level of the communities’ charitable donations and altruism.
          </p>
          <p className={styles.paragraph}>
            Creators will be taken on a journey to share and be rewarded for
            their on-chain meditation content which will be available in-app,
            and we will later launch a token that captures the value we will
            create.
          </p>

          <p className={styles.paragraph}>
            Learn more in our{' '}
            <a
              className={styles.link}
              href="https://www.momentsofspace.com/whitepaper"
              target="_blank"
              rel="noreferrer"
            >
              whitepaper
            </a>
            . We hope you will join our journey, whether collaboratively, in
            spirit or support, or simply by letting us help you find more
            Moments of Space.
          </p>
        </div>

        {signature ? (
          <>
            <h4 className={styles.signatureHeading}>Your Signature</h4>
            <p className={styles.signature}>{signature}</p>
            <p className={styles.signatureAddress}>
              — <Address address={address} />
            </p>
          </>
        ) : (
          <div className="flex justify-center my-16">
            <button className={styles.button} onClick={signLetter}>
              Sign the Open Letter
            </button>
          </div>
        )}
      </main>
      <div className={`${styles.info} justify-center p-6`}>
        <p>
          {signers && signers.length} people have signed the open letter so far
          including
        </p>
        <div className={styles.signers}>
          <ul>
            {signers &&
              signers
                .filter((signer) => signer.pinned === true && signer.ens)
                .map((signer) => <li key={signer.address}>{signer.ens}</li>)}
          </ul>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Home
