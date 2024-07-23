import Head from "next/head";

export default function CustomHead({
    title,
    description,
    favicon,
    ogImage
}){
    return(
        <Head>
            <title>{ title || 'Nerdola - administrativo'}</title>
            <meta name="description" content={ description || "" } />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href={favicon || "/logo_pequena.png" } />
            <meta property="og:image" content={ ogImage || "" }/>
  		    <meta name="robots" content="noindex, nofollow"/>
        </Head>
    )
}