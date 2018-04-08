import React from 'react'

export default class Tips extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentWillMount () {
    setPageTitle(this.state)
  }
  componentDidMount () {
    analytics.page('Tips')
  }
  render () {
    let tipsHtml = tips.map((tip, index) => {
      let imgClass = ''
      let imgStyle = {}
      if (tip.maxImageWidth) {
        imgClass = 'img-custom-max-width'
        imgStyle = {
          maxWidth: tip.maxImageWidth + 'px'
        }
      }
      return <div key={index} className="tip py-4 px-2 p-sm-5 mb-5 d-flex flex-md-row flex-column-reverse" itemScope itemType="http://schema.org/BlogPosting">
        <div className="tip-image col-md-5 text-center align-self-center">
          <img
            itemProp="image"
            className={`img-fluid mx-auto ${imgClass}`}
            src={tip.image}
            style={imgStyle}
            alt=""
          />
        </div>
        <div className="tip-content pb-3 pb-md-0 col-md-6">
          <span className="h3">Pro Tip #{index + 1}</span>
          <h3 className="h4 mt-2" itemProp="headline">{tip.title}</h3>
          <div itemProp="articleBody" dangerouslySetInnerHTML={{
            __html: tip.body.replace(/\n/g, '<br />')
          }} />
        </div>
      </div>
    })
    return <section id="view-tips">
      <div id="blogPosts" className="bg-light pb-5">
        <h2 className="h4 py-4 text-center">10 Pro Tips</h2>
        <div className="container">{tipsHtml}</div>
      </div>
    </section>
  }
}

const tips = [{
  title: 'Don\'t use the slide master.',
  body: 'Aside from being hard to find and confusing to use, the slide master encourages a bulleted outline layout, which makes for very dull visuals. It is much easier to manage presentation layout by ignoring the slide master and instead copy-pasting elements directly onto each slide.',
  image: '/images/tips/tip1.png'
}, {
  title: 'Don\'t use the defaults.',
  body: 'Default templates are in an awkward square dimension. Default fonts are too large. Default color palettes have too much repetition. Default shapes have loud colors and dated-looking shadows.',
  image: '/images/tips/tip2.png'
}, {
  title: 'Do use copyright-safe images.',
  body: 'Googling an image is easy but finding one that is copyright-safe is difficult. It is better to use trusted sources to either buy an image license or find images that are copyright-free.\n\nFor more tips on sourcing images, go to the Finding Images section of Templates and Tips.',
  image: '/images/tips/tip3.png',
  maxImageWidth: 300
}, {
  title: 'Don\'t brand every slide with your logo.',
  body: 'A logo on every slide not only makes your deck look dated, it takes up valuable space for your message. Your audience should be introduced to your company on the Cover Slide and reminded again on the Conclusion Slide.',
  image: '/images/tips/tip4.png'
}, {
  title: 'Do use interstitial slides to change topics.',
  body: 'An interstitial slide is a title page for a subtopic of your presentation. It gives your audience a visual cue to your topic change and is a great place to add visual interest.',
  image: '/images/tips/tip5.png'
}, {
  title: 'Do keep it one thought per slide.',
  body: 'For large audiences, rather than condense all of your thoughts into a minimum of slides, spread your message out. This aids in richer storytelling and audience comprehension and gives you room to illustrate your points.',
  image: '/images/tips/tip6.png'
}, {
  title: 'Don\'t use the automatic bullets.',
  body: 'PowerPoint\'s automatic bullets are clunky and hard to control. To mark a list of items, use a hyphen.\n\nConceptually, bullets are problematic because they are often used to outline the speaker\'s script, which makes for dull visuals and encourages the audience to read ahead rather than listen.',
  image: '/images/tips/tip7.png'
}, {
  title: 'Do trim text where you can.',
  body: 'Can your text be shorter and more succinct? Wherever possible, trim out passive phrases, conversational writing and adjectives, all which add visual clutter to a message.',
  image: '/images/tips/tip8.png'
}, {
  title: 'Do create a custom color palette.',
  body: 'As mentioned in Tip #2, PowerPoint\'s standard and theme colors are difficult to work with. Creating your own palette is easy and using it throughout your presentation will make the design cohesive.\n\nEach Slide Therapy Template file has a worksheet which guides you through the process of creating your own custom harmonious color palette.',
  image: '/images/tips/tip9.png',
  maxImageWidth: 230
}, {
  title: 'Do use a dark template for a dark room.',
  body: 'For a large audience, if you know that the room that you will be presenting in will be very dark, consider using the dark background templates. Much like how dark backgrounds are easier for reading from your tablet in bed at night, the slides will be easier on your audience\'s eyes in a dark room.\n\nThe Large Audience Slide Therapy Template and Tips file contains both dark and light background slide designs.',
  image: '/images/tips/tip10.png'
}]
