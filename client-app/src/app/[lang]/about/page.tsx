import React from 'react'
import { getDictionary } from '../../../../getDictionaries';

const AboutPage = async({params,}:  {
  params: { lang?: string };
}) => {
  const langKey = params?.lang || "en"; // Default to 'en'
    const lang = await getDictionary(langKey); // Await as expected
    console.log("params from about", lang);
  return (
    <>
        <div>AboutPage</div>
        <h1>{lang.about.dec}</h1>
        <label>{lang.form.name}</label>
        <input type="text" placeholder="Enter Name"/>
        <label>{lang.form.email}</label>
        <input type="text" placeholder="Email"/>
    </>
  )
}

export default AboutPage 