import React from 'react'

export default class About extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <section id="view-about" className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <h3><em>Pro treatment for presentation problems</em></h3>
          </div>
          <div className="col-sm-6">
            <h2>About Slide Therapy</h2>
            <p>Slide Therapy is a series of master powerpoint decks that make it quick and easy to pull together a glossy, well-designed presentation for large, small and solitary audiences.</p>
            <p>This system uses a PowerPoint file to contain both a series of slide templates and a book of tips and tricks.</p>
            <p>Created by a tech designer, these templates and tricks allow people of any field to communicate clearly, look polished, and spend less time making their presentation.</p>

            <h2>About Us</h2>
            <p>We are a product designer and a software engineer who teamed up to create The None Percent, a company focused on creating design solutions that keep an individual’s best interests in mind.</p>

            <p>Because each of us is the 0.000000014286%.</p>

            <h2>Say Hello</h2>
            <p><a href="mailto:hello@slidetherapy.com">hello@slidetherapy.com</a></p>
          </div>
        </div>
      </div>
    </section>
  }
}
