import React from 'react'
import {useRouter} from 'next/router'
import styles from '../styles/detail.module.css';
import {FaCheckCircle} from "react-icons/fa"
import Link from 'next/link'
import Head from 'next/head';
import Image from 'next/image'
import { useState } from 'react';

interface Campaign {
    slug : string
}
export default function Campaign({ data }:any) {
    const [email,setEmail] = useState("")
    const [IsSubmitting, setIsSubmitting] = useState(false)
    const [IsSubmitted, setIsSubmitted] = useState(false)

    const handleOnSubmit = (e : any) => {
        e.preventDefault();

        const options = {
            method: "POST",
            body: JSON.stringify({
                email,
                campaign: data.id
            }),

            headers: {
                'Content-Type': 'application/json'
            }
        }   
        
        setIsSubmitting(true)
        fetch("http://127.0.0.1:8000/api/subscribers", options). 
        then(res=>res.json()).then(response => {
            setIsSubmitted(true);
        }).catch(error => console.log(`error`, error)).finally(() => {
            setIsSubmitting(false); 
        })
    }

    return (
        <div><Head>
            <title>{data.title}</title>
            <meta name="description" content={data.description}/> 
        </Head>
            <div className={styles.wrapper}>
                <div className={styles.main}>
                </div>
                <div className={styles.contents}>
                    <Image className={styles.img} src={"http://res.cloudinary.com/dqawhgj6i/" + data.logo} height={180} width={180} alt="Campaign Banner"/>
                    <div className={styles.grid}>
                        <div className={styles.left}>
                            <h1 className={styles.title}>{data.title}</h1>
                            <p className={styles.description}>{data.description}</p>
                        </div>
                        <div className={styles.right}>
                            {!IsSubmitted? <div className={styles.rightContents}>
                                <form onSubmit={handleOnSubmit}>
                                    <div className={styles.formGroup}>
                                        <input 
                                            onChange={(event) => {
                                                setEmail(event.target.value)
                                            }}
                                        required type="email" name="email" placeholder="Enter an Email" className={styles.input}/>
                                    </div>
                                    <div className={styles.submit}>
                                        <input type="submit" value={IsSubmitting ? "PLEASE WAIT" : "SUBSCRIBE"} disabled={IsSubmitting} className={styles.button}
                                        />
                                        <p className={styles.consent}>We respect your privacy. Unsubscribe any time.</p>
                                    </div>
                                </form>
                             </div>:<div className={styles.thankyou}>
                                    <div className={styles.icon}>
                                        <FaCheckCircle size={17} color="green"/>
                                    </div>
                                    <div className={styles.icon}>
                                        Thank you for you subscription
                                    </div>
                             </div>
                        } </div>
                    </div>
                </div>
            </div>
                <footer className={styles.footer}>
                    <Link href="/">Go back to list</Link>
                </footer>
        </div>
    )
}

export async function getStaticPaths() {
    const response = await fetch(`${process.env.BASE_URL}/campaigns`)
    const data: Campaign[] = await response.json()
    const allSlugs = data.map((item) => item.slug)
    const paths = allSlugs.map(slug => ({ params: {slug: slug}}))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }:any) {
    const response = await fetch(`${process.env.BASE_URL}/campaigns/${params.slug}`)
    const data: Campaign[] = await response.json()
    return {
        props: {
            data
        }
    }
}