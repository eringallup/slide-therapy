/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'

export default class Privacy extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    setPageTitle(this.state)
  }

  componentDidMount () {
    stAnalytics.page('Privacy')
  }

  render () {
    // https://termsfeed.com/blog/privacy-policy-google-analytics/
    return <div id="privacy" className="bg-light">
      <div className="container">
        <div className="row">
          <div className="col col-md-10 offset-md-1 col-lg-8 offset-lg-2 my-4 bg-white py-4 px-5">
            <h2 className="h4">Slide Therapy Privacy Policy</h2>
            <p><cite style={{ fontStyle: 'normal' }}>Effective: May 24, 2018</cite></p>
            <p>This privacy policy has been compiled to better serve those who are concerned with how their &apos;Personally Identifiable Information&apos; (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.</p>
            <h3>What personal information do we collect from the people that visit our website?</h3>
            <p>When ordering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, credit card information or other details to help you with your experience.</p>
            <h3>When do we collect information?</h3>
            <p>We collect information from you when you place an order or enter information on our site.</p>
            <h3>How do we use your information?</h3>
            <p>We may use the information we collect from you when you make a purchase, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:</p>
            <ul>
              <li>To quickly process your transactions.</li>
              <li>To ask for ratings and reviews of our products</li>
              <li>To follow up after correspondence (live chat, email)</li>
            </ul>
            <h3>Choices You Have Regarding Personal Data</h3>
            <p>If you otherwise wish to ask for access, correction, or deletion of any of your information held by us, or a change in the way we use your information, please contact us at <a href="mailto:support@slidetherapy.com">support@slidetherapy.com</a>. We may decline requests that are unreasonable, prohibited by law, or are not required to be honored by applicable law.</p>
            <h3>How Personal Data May Be Transferred to the United States</h3>
            <p>We operate from data centers in multiple locations globally, including in the United States. Any data you submit on this site may result in the transfer, use, processing, or storage of Personal Data in the United States or any other country where we operate or maintain facilities or service centers, including jurisdictions that may not have data privacy laws that provide protections equivalent to those provided in your home country. We takes steps designed to ensure that the Personal Data is processed according to applicable law wherever the data is located.</p>
            <p>By providing your information to us, you agree to that transfer, storage, and processing of your Personal Data in the United States.</p>
            <h3>How do we protect your information?</h3>
            <p>Wherever we collect sensitive information (such as credit card data), that information is encrypted and transmitted to us in a secure way. You can verify this by looking for a lock icon in the address bar and looking for &quot;https&quot; at the beginning of the address of the Web page.</p>
            <p>Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible.</p>
            <p>We use regular Malware Scanning.</p>
            <p>Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.</p>
            <p>We implement a variety of security measures when a user places an order, enters, submits, or accesses their information to maintain the safety of your personal information.</p>
            <p>All transactions are processed through a gateway provider and are not stored or processed on our servers.</p>
            <h3>Do we use &apos;cookies&apos;?<a name="cookies" /></h3>
            <p>Yes. Cookies are small files that a site or its service provider transfers to your computer&apos;s hard drive through your Web browser (if you allow) that enables the site&apos;s or service provider&apos;s systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
            <h3>We use cookies to:</h3>
            <ul>
              <li>Help remember and process the items in the shopping cart.</li>
              <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.</li>
            </ul>
            <p>You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since browser is a little different, look at your browser&apos;s Help Menu to learn the correct way to modify your cookies.</p>
            <h3>If users disable cookies in their browser:</h3>
            <p>If you turn cookies off, you will not be able to make purchases on this site.</p>
            <h3>Do Not Track (DNT)</h3>
            <p>We honor Do Not Track signals and do not track, set cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.</p>
            <h3>Third-party disclosure</h3>
            <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when it&apos;s release is appropriate to comply with the law, enforce our site policies, or protect ours or others&apos; rights, property or safety.</p>
            <p>However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
            <h3>Third-Party Behavioral Tracking</h3>
            <p>We do not use third-party behavioral tracking. You may opt out of the automated collection of information by third-party ad networks for the purpose of delivering advertisements tailored to your interests, by visiting the consumer opt-out page for the Self-Regulatory Principles for Online Behavioral Advertising at <a target="_blank" rel="noopener noreferrer" className="break-word" href="http://www.aboutads.info/choices/">http://www.aboutads.info/choices/</a> and edit or opt-out your Google Display Netowrk ads&apos; preferences at <a target="_blank" rel="noopener noreferrer" className="break-word" href="http://www.google.com/ads/preferences/">http://www.google.com/ads/preferences/</a>.</p>
            <h3>Third-party links</h3>
            <p>We do not include or offer third-party products or services on our website.</p>
            <h3>Google AdWords</h3>
            <p>This website uses the Google AdWords remarketing service to advertise on third party websites (including Google) to previous visitors to our site. It could mean that we advertise to previous visitors who haven&apos;t completed a task on our site. This could be in the form of an advertisement on the Google search results page, or a site in the Google Display Network. Third-party vendors, including Google, use cookies to serve ads based on someone&apos;s past visits to the Slide Therapy website. Of course, any data collected will be used in accordance with our own privacy policy and Google’s privacy policy.</p>
            <p>We have enabled the following Google Analytics advertising features:</p>
            <ul>
              <li>Remarketing with Google Analytics</li>
              <li>Google Display Network Impression Reporting</li>
              <li>Integrated services that require Google Analytics to collect data for advertising purposes, including the collection of data via advertising cookies and identifiers.</li>
            </ul>
            <p>Google&apos;s advertising requirements can be summed up by Google&apos;s Advertising Principles. They are put in place to provide a positive experience for users. <a target="_blank" rel="noopener noreferrer" className="break-word" href="https://support.google.com/adwordspolicy/answer/1316548?hl=en">https://support.google.com/adwordspolicy/answer/1316548?hl=en</a></p>
            <p>We have not enabled Google AdSense on our site but we may do so in the future.</p>
            <h3>California Online Privacy Protection Act</h3>
            <p>CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law&apos;s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. See more at: <a target="_blank" rel="noopener noreferrer" className="break-word" href="http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf">http://consumercal.org/california-online-privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf</a></p>
            <h3>According to CalOPPA, we agree to the following:</h3>
            <p>Users can visit our site anonymously.</p>
            <p>Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website.</p>
            <p>Our Privacy Policy link includes the word &apos;Privacy&apos; and can easily be found on the page specified above.</p>
            <p>You will be notified of any Privacy Policy changes:</p>
            <ul>
              <li>On our Privacy Policy Page</li>
            </ul>
            <p>Can change your personal information:</p>
            <ul>
              <li>By emailing us</li>
            </ul>
            <h3>COPPA (Children Online Privacy Protection Act)</h3>
            <p>When it comes to the collection of personal information from children under the age of 13 years old, the Children&apos;s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States&apos; consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children&apos;s privacy and safety online.</p>
            <p>We do not specifically market to children under the age of 13 years old.</p>
            <h3>Fair Information Practices</h3>
            <p>The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.</p>
            <h3>In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:</h3>
            <p>We will notify you via email</p>
            <ul>
              <li>Within 72 hours</li>
            </ul>
            <p>We will notify the users via in-site notification</p>
            <ul>
              <li>Within 72 hours</li>
            </ul>
            <p>We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.</p>
          </div>
        </div>
      </div>
    </div>
  }
}
