import React from 'react'
import { Link } from 'react-router-dom'
import skus from 'skus.json'

export default class Templates extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  componentDidMount () {
    if (typeof global.document !== 'undefined') {
      if (location.pathname === '/start') {
        scrollIt(document.getElementById('start'), 200, 'easeInCubic')
      } else if (/templates|buy/i.test(location.pathname)) {
        if (window.pageYOffset < 10) {
          scrollIt(document.getElementById('templates'), 200, 'easeInCubic')
        }
      } else if (location.pathname === '/') {
        if (window.history.length > 1) {
          scrollIt(document.body, 100, 'easeInCubic')
        }
      }
    }
  }
  render () {
    const templates = [skus[1], skus[2], skus[3]].map(item => {
      return <div
        key={item.sku}
        className="deck"
        itemScope itemType="http://schema.org/Product"
      >
        <Link className="d-flex" to={`/buy/${item.slug}`}>
          <span
            className="order-0 text-secondary"
          >{item.sku}</span>
          <h4
            itemProp="name"
            className="order-2 text-dark"
          >{item.title} - ${item.displayPrice}</h4>
          <div
            itemProp="image"
            className="order-1"
          ><img className="img-fluid" src={item.image} /></div>
          <div
            className="order-3"
          ><span className="buy btn btn-primary">Buy</span></div>
        </Link>
      </div>
    })
    return <section id="view-templates">
      <div
        className="hero-layer d-flex align-items-center"
        style={{
          backgroundImage: 'url(/images/home/topimage1.jpg)'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h2>Up your presentation game</h2>
              <Link to="/start" className="btn btn-primary">Start now</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h3>Expert-Designed PowerPoint Templates <em>with built-in mentoring</em></h3>
          </div>
        </div>
        <div id="start" className="bg-light">
          <div className="row">
            <div className="col text-center">
              <h3>Communicate Clearly. Work Faster. Look Elegant.</h3>
              <p className="lead">Slide Therapy is a series of master PowerPoint files that include everything you need to make a stunning presentation:</p>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h4>Templates</h4>
              <ol className="list-unstyled">
                <li>28 light templates</li>
                <li>24 dark templates</li>
                <li>500+ icon library</li>
                <li>80+ shape library</li>
              </ol>
            </div>
            <div className="col">
              <h4>Tips</h4>
              <ol className="list-unstyled">
                <li>Keeping a Clean Look</li>
                <li>Changing Colors</li>
                <li>Changing Fonts</li>
                <li>Finding Images</li>
                <li>Making Graphics Using Icons</li>
                <li>Making Graphics Using Shapes</li>
                <li>Illustrating Abstract Concepts</li>
                <li>Formatting Graphs</li>
                <li>Formatting Charts</li>
                <li>Formatting Tables</li>
                <li>Adding Maps</li>
              </ol>
            </div>
            <div className="col d-flex align-items-center">
              <img className="img-fluid" src="/images/home/laptop.png" alt="" />
            </div>
          </div>
        </div>
        <div className="row">
          <div
            id="templates"
            itemScope itemType="http://schema.org/Product"
            className="d-flex flex-row w-100 justify-content-center bg-dark"
          >
            <h4 itemProp="name">Special</h4>
            <p
              itemProp="description"
              className="lead"
            >{skus[4].description}</p>
            <div className="full-price">$117</div>
            <div itemProp="offers" itemScope itemType="http://schema.org/Offer">
              <span itemProp="priceCurrency" content="USD">$</span>
              <span itemProp="price" content="99.00">{skus[4].displayPrice}</span>
            </div>
            <Link
              to="/buy/all-audiences"
              className="buy btn btn-primary"
            >Buy</Link>
          </div>
          <div className="bg-light flex-row w-100">{templates}</div>
        </div>
      </div>
    </section>
  }
}
