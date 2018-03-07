import React from 'react';
import { Link } from 'react-router-dom';

export default class Templates extends React.Component {
  constructor(props) {
    super(props);
    this.state = props;
  }
  componentDidMount() {
    if (/templates|buy/i.test(location.pathname)) {
      scrollIt(document.getElementById('templates'), 200, 'easeInCubic');
    } else {
      scrollIt(document.body, 100, 'easeInCubic');
    }
  }
  render() {
    return <section id="view-templates">
      <div className="hero-layer d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 text-center">
              <h2>Up your presentation game</h2>
              <Link to="/templates" className="btn btn-primary">Start now</Link>
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
        <div className="row">
          <div className="col">
            <p>It&apos;s no secret- PowerPoint is notoriously difficult to work with. With its multitude of tools, hidden confusing Slide Master and its outdated templates, it can be a real challenge to get the story right, much less make it look good. And when it doesn&apos;t look good, your message can get lost.</p>
          </div>
          <div className="col">
            <p>Luckily there is Slide Therapy- a presentation template that also includes all of the design tips and assets you need to make your presentation great. Created by a veteran Silicon Valley designer, the templates are modern in design and easily customizable. So your presentation will look good- and your message will shine.</p>
          </div>
        </div>
      </div>
      <div id="templates" className="bg-gray1">
        <div className="container">
          <div className="row">
            <div className="col">
              <h3 className="curlies">2018 Templates</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Link to="/buy/halcyon">
                <h4 className="text-dark">Halcyon - $29</h4>
                <div className="img-placeholder"></div>
                <span className="buy btn btn-primary">Buy</span>
              </Link>
            </div>
            <div className="col">
              <Link to="/buy/summit">
                <h4 className="text-dark">Summit - $29</h4>
                <div className="img-placeholder"></div>
                <span className="buy btn btn-primary">Buy</span>
              </Link>
            </div>
            <div className="col">
              <Link to="/buy/hitchcock">
                <h4 className="text-dark">Hitchcock - $29</h4>
                <div className="img-placeholder"></div>
                <span className="buy btn btn-primary">Buy</span>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h3 className="line-through">Included With Purchase</h3>
            </div>
          </div>
          <div className="row">
            <div className="col col-8">
              <div className="icon-with-text">
                <img src="with-purchase-deck.png" alt="135 page Pro Tips Deck"/>
                <p>135 page Pro Tips Deck with easy to follow design instructions</p>
              </div>
              <i className="fa fa-plus"></i>
              <div className="icon-with-text">
                <img src="with-purchase-icon-library.png" alt="500+ Icons"/>
                <p>A library of 500+ icons included in the deck</p>
              </div>
            </div>
            <div className="col">
              <h5>Pro Tips Include</h5>
              <ul>
                <li>Altering your template</li>
                <li>Slide Types + their best use</li>
                <li>How to adhere to a grid layout</li>
                <li>Creating a custom color palette</li>
                <li>Finding great images</li>
                <li>Formatting charts &amp; graphs</li>
                <li>Making tables look great</li>
                <li>Creating beautiful diagrams</li>
                <li>Changing typography</li>
                <li>Illustrating with icons</li>
                <li>Integrating maps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h3>How <em>it works</em></h3>
          </div>
        </div>
        <div className="row">
        </div>
      </div>
    </section>;
  }
}
