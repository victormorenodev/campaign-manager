import React from 'react'
import {useRouter} from 'next/router'

export default function Campaign() {
    const { query: {slug} } = useRouter()
    console.log('slug :>> ',slug)
    return (
        <div>
            <h1>Campaign</h1>
        </div>
    )
}