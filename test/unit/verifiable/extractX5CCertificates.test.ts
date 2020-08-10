import 'mocha'

import { assert } from 'chai'

import { extractX5CCertificates } from '../../../src/verifiable/certificate-chain-validator'

describe('extractX5CCertificates()', function () {
  const nakedCert =
    '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'

  it('succeeds verification of chain if Root CA configured', async function () {
    const jwk = {
      kty: 'RSA',
      // eslint-disable-next-line id-length,id-blacklist -- JWK dictates
      e: 'AQAB',
      use: 'sig',
      // eslint-disable-next-line id-length -- JWK dictates this
      n:
        'nq5zAkTi9dldHeBx5L3BvI8uvd_YOjHdcJz-7GB0OW_dN7J8mcchPN6YGmJZajJav7ZeqOXSrQZoqfrt-QN_YogiqRs4Dj6LnVIQ29bXW1OyPp4ZpfwNLBettcehP-NcmwBNgvEecx1ap5z5qZym0qgJsjv2S6LeFrGwPfnvx4leLvA6ZuD90VtXxYwOVakYeJpPqmHZbPDxVz673izi3g9UUWh-Iz6GSdpj7ZNf2m7C5F1numYkrAEG3ZjnuTbt_scQij_9M-3wyJOY_Hac5SDnZDLXtequvL51wEYpSOumtR1GwBQ6NjmUudtgbpwq85zWC7VUHjKvuFxKD7HMXAAcHZ3aQ0PsDqy7qBeX7T8qAH6yTK2Uu-hj_h3Ua5Tz05xboXuTbgPyzFJRa3kv535NHa55nu6L0Vpx1NUFt7pRz9V4usnSW6ElwYbqIxdN3DRzqoKlTcIkgS_0YJku6-94diX8CUvu9rbACLDEQqxzfdt3TGyos3JzheQVtgYQn9IHNDYBrrCMrKYKgZCAhp97Sba6Vi1IXVHZggQ1e7zAhxMsPb-YlxsMzqf70T3DNQTHYxhHSV4_SHIKh_8knCu_-bFg9fb4anXCXzD-C9GSZS-DFmYpdTkgE6t5DEH1mPC5scdOljPDWQaoJQq1cgwjR1xOHZOthwy0QOSVf2k',
      x5c: [nakedCert, nakedCert],
    }
    const protectedHeaders = { jwk }
    const protectedBase64 = Buffer.from(
      JSON.stringify(protectedHeaders),
    ).toString('base64')

    const x5c = extractX5CCertificates({
      protected: protectedBase64,
      signature: 'not-a-real-signature',
    })
    assert.lengthOf(x5c, 2)
  })
})