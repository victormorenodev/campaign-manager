import Image from 'next/image'
import {useRouter} from 'next/router'
import Head from 'next/head'
import styles from '../styles/home.module.css';
import dateformat from "dateformat"
import Link from 'next/link'

interface FetchProps {
  data: any;
  error: any,
}

export default function Home({data, error}: FetchProps) {
  const router = useRouter()
  console.log('data :>> ', data);
  console.log('error :>> ', error);

  const handleNavigation=({ slug }:any) => {
    router.push("/"+slug) 
  }
  return (
    <div>
      <Head>
        <title>Campaign Manager | Home</title>
        <meta name="description" content="A site for campaigns"/>
      </Head>
      <main className={styles.main}>
        <div className={styles.innerContent}>
          <h1>Available Campaigns</h1>

          {error&&<p>{JSON.stringify(error)}</p>}

          {data.map((element: any) => <div key={element.slug}>

          <div className={styles.item} onClick={ ()=> handleNavigation(element)}>

            <div className={styles.imgContainer}>
              <Image className={styles.img} src={"http://res.cloudinary.com/dqawhgj6i/" + element.logo} height={120} width={120} alt="Campaign Banner"/>
            </div>

            <div className={styles.rightItems}>
              <Link href={"/"+element.slug}>{element.title}</Link>
              <p>{element.description}</p>
              <small>{dateformat(new Date(element.created_at), "dddd, mmmm, dS, yyyy, h:MM:ss TT")}</small>
            </div>
          </div>
        </div>
          )}
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps(){
  let data = [];
  let error = null; 
  try {
    const response = await fetch(`${process.env.BASE_URL}/campaigns`)
    data = await response.json()
  } catch (err: any) {
    console.log('err :>> ',err);
    error = err.message?err.message:"Something went wrong"
  }

  return {
    props:{
      data,
      error,
    }
  }
}
