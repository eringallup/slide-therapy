import React from 'react'

export default class Quotes extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <div className="quotes mt-5">
      <div className="bg-lite container py-5">
        <div className="row mx-auto">
          <div className="col">
            <h4 className="text-center mb-4">Quotes</h4>

            <div id="quotesCarousel" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <blockquote>
                    The focus on diving in and playing around vs. giving a whole bunch of theories about design are great for folks like me who want to just dive in. I learn by doing, so this really resonated with me.
                    <br /><br />
                    Making my deck was actually very easy. I spent a lot of time tweaking fonts, colors to make it my own. But what the Slide Therapy product did help me a lot with was ideas for how to lay out the different points and bits of information I had in my mental outline. It was so easy to make my presentation look professionally designed!
                    <br /><br />
                    Anyone who&apos;s a PM or marketing manager should use this product to make their presentations great.
                    <cite className="d-block pt-3">
                      – Lesley G.<br />
                      San Francisco
                    </cite>
                  </blockquote>
                </div>
                <div className="carousel-item">
                  <blockquote>
                    I really like the way Slide Therapy builds up a deck through intuitive explanations and logic, and helps me create more visual storytelling decks in stead of the usual bullet lists and text walls. Using the deck also helped me a lot to understand structure and the various components that make up at good slide deck.
                    <br /><br />
                    It has proven invaluable in helping me getting my message across, and I highly recommend Slide Therapy to anyone who struggles to make better presentations.
                    <br /><br />
                    <cite className="d-block pt-3">
                      – Marius J.<br />
                      Engineering Leader
                      Oslo, Norway
                    </cite>
                  </blockquote>
                </div>
              </div>
              <a className="carousel-control-prev" href="#quotesCarousel" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#quotesCarousel" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
