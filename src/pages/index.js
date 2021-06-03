/** @jsxImportSource theme-ui */

import { Box, jsx } from 'theme-ui'
import { useState, useEffect, Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../apollo/client'
import Layout from '../components/Layout'

import { SearchIcon } from '../icons/Search.js'
import { EPOCHES_QUERY } from '../apollo/queries'

const Index = () => {
  return (
    <Box>
      <Box
        sx={{
          py: '5rem',
          px: '2rem',
        }}
      >
        <div
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h1
            sx={{
              m: 0,
            }}
          >
            Epochs
          </h1>
          <div
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: '2rem',
            }}
          >
            {/* TODO: Check if there is a better semantic element */}
            <div
              sx={{
                height: '100%',
                width: '1px',
                bg: 'white',
                mx: '1rem',
              }}
            />
            <SearchIcon />
            <input
              sx={{
                bg: 'transparent',
                border: 'none',
                color: 'white',
                ':focus': {
                  outline: 'none',
                },
              }}
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        <Layout>
          <Table />{' '}
        </Layout>
      </Box>
    </Box>
  )
}

function Table() {
  const { loading, error, data } = useQuery(EPOCHES_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>There was an error!</p>

  console.log(data)
  const epoches = data?.epoches
  if (epoches) {
    console.log(epoches[3].queryFeeRebates)
  }

  return (
    <section
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
      }}
    >
      <TableHeaderButton>Epoch</TableHeaderButton>
      <TableHeaderButton>Start Block</TableHeaderButton>
      <TableHeaderButton>End Block</TableHeaderButton>
      <TableHeaderButton>Query Fees</TableHeaderButton>
      <TableHeaderButton>Total Rewards</TableHeaderButton>

      {epoches
        .slice(0, 10)
        .map(({ id, startBlock, endBlock, queryFeeRebates, totalRewards }) => (
          <Fragment key={id}>
            <TableCell>{id}</TableCell>
            <TableCell>#{startBlock}</TableCell>
            <TableCell>#{endBlock}</TableCell>
            <GRTCell>{formatNumber(queryFeeRebates)}</GRTCell>
            <GRTCell>{formatNumber(totalRewards)}</GRTCell>
          </Fragment>
        ))}
    </section>
  )
}

function TableHeaderButton({ children }) {
  let focusState = 'hover'

  return (
    <button
      sx={{
        bg: 'transparent',
        color: 'white', // TODO: figure out how to use theme colors
        border: 'none',
        fontFamily: 'heading',
        textTransform: 'uppercase',
        textAlign: 'left',
        pl: '1rem',
        py: '1rem',
        '--border-opacity': '0.2',
        ':hover': {
          '--border-opacity': '0.5',
        },
        ':focus': {
          '--border-opacity': '1',
        },
        borderBottom: '2px solid rgba(255, 255, 255, var(--border-opacity))',
      }}
    >
      {children}
    </button>
  )
}

function TableRow({ id, startBlock, endBlock, queryFeeRebates, totalRewards }) {
  return (
    <>
      <span>{id}</span>
    </>
  )
}

function TableCell({ children }) {
  return (
    <span
      sx={{
        color: 'white', // TODO: figure out how to use theme colors
        border: 'none',
        fontFamily: 'heading',
        textTransform: 'uppercase',
        textAlign: 'left',
        pl: '1rem',
        py: '1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {children}
    </span>
  )
}

function GRTCell({ children }) {
  return (
    <span
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'white', // TODO: figure out how to use theme colors
        border: 'none',
        fontFamily: 'heading',
        textTransform: 'uppercase',
        textAlign: 'left',
        pl: '1rem',
        py: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {children}
      <span
        sx={{
          fontSize: '0.5rem',
          pl: '0.5rem',
        }}
      >
        GRT
      </span>
    </span>
  )
}

function formatNumber(number) {
  const n = Number(number)
  return n === 0 ? 0 : Math.round((n / 10) ^ 18)
}

export default withApollo(Index, { ssr: false })
