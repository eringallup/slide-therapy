import React from 'react'
import pageData from 'pages.json'

export default class Terms extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentWillMount () {
    if (typeof document !== 'undefined') {
      document.title = pageData[this.state.location.pathname].title
    }
  }
  componentDidMount () {
    analytics.page('Terms')
  }
  render () {
    // https://support.ecwid.com/hc/en-us/articles/207100249-English-Terms-and-Conditions-templates
    const companyName = 'The None Percent'
    const productName = 'Slide Therapy'
    const companyState = 'Illinois'
    return <div id="terms" className="container">
      <div className="row">
        <div className="col my-3">
          <h2 className="text-uppercase">{productName} TERMS OF USE</h2>
          <p><cite style={{fontStyle: 'normal'}}>February 7, 2018</cite></p>
          <p>Welcome to our online store! {companyName} provides its services to you subject to the following conditions. If you visit or shop within this website, you accept these conditions. Please read them carefully. ​</p>
          <h3>PRIVACY</h3>
          <p>Please review our Privacy Notice, which also governs your visit to our website, to understand our practices.</p>
          <h3>ELECTRONIC COMMUNICATIONS</h3>
          <p>When you visit {companyName} or send e-mails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by e-mail or by posting notices on this site. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</p>
          <h3>COPYRIGHT</h3>
          <p>All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of {companyName} or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of {companyName}, with copyright authorship for this collection by {companyName}, and protected by international copyright laws.</p>
          <h3>TRADE MARKS</h3>
          <p>{companyName}&apos;s trademarks and trade dress may not be used in connection with any product or service that is not {companyName}&apos;s, in any manner that is likely to cause confusion among customers, or in any manner that disparages or discredits {companyName}. All other trademarks not owned by {companyName} or its subsidiaries that appear on this site are the property of their respective owners, who may or may not be affiliated with, connected to, or sponsored by {companyName} or its subsidiaries.</p>
          <h3>LICENSE AND SITE ACCESS</h3>
          <p>{companyName} grants you a limited license to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it, except with express written consent of {companyName}. This license does not include any resale or commercial use of this site or its contents: any collection and use of any product listings, descriptions, or prices: any derivative use of this site or its contents: any downloading or copying of account information for the benefit of another merchant: or any use of data mining, robots, or similar data gathering and extraction tools. This site or any portion of this site may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of {companyName}. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of {companyName} and our associates without express written consent. You may not use any meta tags or any other &quot;hidden text&quot; utilizing {companyName}&apos;s name or trademarks without the express written consent of {companyName}. Any unauthorized use terminates the permission or license granted by {companyName}. You are granted a limited, revocable, and nonexclusive right to create a hyperlink to the home page of {companyName} so long as the link does not portray {companyName}, its associates, or their products or services in a false, misleading, derogatory, or otherwise offensive matter. You may not use any {companyName} logo or other proprietary graphic or trademark as part of the link without express written permission.</p>
          <h3>REVIEWS, COMMENTS, EMAILS, AND OTHER CONTENT</h3>
          <p>Visitors may post reviews, comments, and other content: and submit suggestions, ideas, comments, questions, or other information, so long as the content is not illegal, obscene, threatening, defamatory, invasive of privacy, infringing of intellectual property rights, or otherwise injurious to third parties or objectionable and does not consist of or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings, or any form of &quot;spam.&quot; You may not use a false e-mail address, impersonate any person or entity, or otherwise mislead as to the origin of a card or other content. {companyName} reserves the right (but not the obligation) to remove or edit such content, but does not regularly review posted content. If you do post content or submit material, and unless we indicate otherwise, you grant {companyName} and its associates a nonexclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media. You grant {companyName} and its associates and sublicensees the right to use the name that you submit in connection with such content, if they choose. You represent and warrant that you own or otherwise control all of the rights to the content that you post: that the content is accurate: that use of the content you supply does not violate this policy and will not cause injury to any person or entity: and that you will indemnify {companyName} or its associates for all claims resulting from content you supply. {companyName} has the right but not the obligation to monitor and edit or remove any activity or content. {companyName} takes no responsibility and assumes no liability for any content posted by you or any third party.</p>
          <h3>PRODUCT DESCRIPTIONS</h3>
          <p>{companyName} and its associates attempt to be as accurate as possible. However, {companyName} does not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free. If a product offered by {companyName} itself is not as described, your sole remedy is to request a refund by emailing help@slidetherapy.com within 10 days of purchase. <br /><br /><span className="text-uppercase">DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY THIS SITE IS PROVIDED BY {companyName} ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. {companyName} MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THIS SITE OR THE INFORMATION, CONTENT, MATERIALS, OR PRODUCTS INCLUDED ON THIS SITE. YOU EXPRESSLY AGREE THAT YOUR USE OF THIS SITE IS AT YOUR SOLE RISK. TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, {companyName} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. {companyName} DOES NOT WARRANT THAT THIS SITE, ITS SERVERS, OR E-MAIL SENT FROM {companyName} ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. {companyName} WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING FROM THE USE OF THIS SITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL, PUNITIVE, AND CONSEQUENTIAL DAMAGES. CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.</span></p>
          <h3>PRODUCT DOWNLOAD</h3>
          <p>Our products are delivered by Internet download only. After your purchase has been approved we will process your order. Orders are typically processed within one (1) minute but could take as long as twenty four (24) hours to complete. Once your order has been processed we will send you a confirmation email using the email address you provided on our order form.</p>
          <p>This email will serve as your electronic purchase receipt and will contain the information you need to access our product downloads.</p>
          <p>Downloads from our servers are closely monitored to ensure you are able to successfully access our products. While we are flexible and allow you to complete a reasonable number of downloads we will not tolerate download abuse. We reserve the right to terminate your access to our download servers.</p>
          <h3>REFUND POLICY</h3>
          <p>We stand behind our products and your satisfaction with them is important to us. However, because our products are digital goods delivered via Internet download we generally offer no refunds.</p>
          <p>If you change your mind about your purchase and you have not downloaded our product, we will happily issue you a refund upon your request.</p>
          <p>Refund requests made after you have downloaded our product are handled on a case by case basis and are issued at our sole discretion. Refund requests, if any, must be made within ten (10) days of your original purchase.</p>
          <h3>APPLICABLE LAW</h3>
          <p>By visiting {companyName}, you agree that the laws of the state of {companyState}, without regard to principles of conflict of laws, will govern these Conditions of Use and any dispute of any sort that might arise between you and {companyName} or its associates.</p>
          <h3>DISPUTES</h3>
          <p>Any dispute relating in any way to your visit to {companyName} or to products you purchase through {companyName} shall be submitted to confidential arbitration in {companyState}, except that, to the extent you have in any manner violated or threatened to violate {companyName}&apos;s intellectual property rights, {companyName} may seek injunctive or other appropriate relief in any state or federal court in the state of {companyState}, and you consent to exclusive jurisdiction and venue in such courts. Arbitration under this agreement shall be conducted under the rules then prevailing of the American Arbitration Association. The arbitrators award shall be binding and may be entered as a judgment in any court of competent jurisdiction. To the fullest extent permitted by applicable law, no arbitration under this Agreement shall be joined to an arbitration involving any other party subject to this Agreement, whether through class arbitration proceedings or otherwise.</p>
          <h3>SITE POLICIES, MODIFICATION, AND SEVERABILITY</h3>
          <p>Please review our other policies, such as our Privacy and Returns policy, posted on this site. These policies also govern your visit to {productName}. We reserve the right to make changes to our site, policies, and these Conditions of Use at any time. If any of these conditions shall be deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining condition.</p>
          <h3>QUESTIONS:</h3>
          <p>Questions regarding our Terms of Use, Privacy Policy, or other policy related material can be directed to our support staff by emailing us at: help@slidetherapy.com</p>
        </div>
      </div>
    </div>
  }
}
