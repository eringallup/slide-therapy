import React from 'react'

export default class Footer extends React.Component {
  constructor (props) {
    super(props)
    this.state = props
  }
  render () {
    return <footer className="d-block">
      <div className="container">
        <div className="row">
          <div className="col py-4 text-center">
            <div className="mb-3">
              <span dangerouslySetInnerHTML={{__html: '<!-- Thanks to Font Awesome for the icons. https://fontawesome.com/license -->'}} />
              <a className="d-inline-block mx-1" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/showcase/slide-therapy/"><svg xmlns="http://www.w3.org/2000/svg" fill="#cccccc" width="26" height="26" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" /></svg></a>
              <a className="d-inline-block mx-1" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UCBD2id4XomBFBVEH_Nt_HEw"><svg xmlns="http://www.w3.org/2000/svg" fill="#cccccc" width="26" height="26" viewBox="0 0 448 512"><path d="M186.8 202.1l95.2 54.1-95.2 54.1V202.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-42 176.3s0-59.6-7.6-88.2c-4.2-15.8-16.5-28.2-32.2-32.4C337.9 128 224 128 224 128s-113.9 0-142.2 7.7c-15.7 4.2-28 16.6-32.2 32.4-7.6 28.5-7.6 88.2-7.6 88.2s0 59.6 7.6 88.2c4.2 15.8 16.5 27.7 32.2 31.9C110.1 384 224 384 224 384s113.9 0 142.2-7.7c15.7-4.2 28-16.1 32.2-31.9 7.6-28.5 7.6-88.1 7.6-88.1z" /></svg></a>
            </div>
            <p className="mb-1 h3 font-size-base">&copy;{new Date().getFullYear()}</p>
            <a className="h3 mb-1 font-size-base" target="_blank" rel="noopener noreferrer" href="http://nonepercent.com">The Nøne Percent LLC</a>
            <p className="d-block my-1 font-size-base font-family-serif font-italic">All rights reserved.</p>
            <p className="d-block my-1">
              <small>
                <a href="/free">Free Stuff</a>
                <span className="text-secondary">&nbsp;&bull;&nbsp;</span>
                <a href="/terms">Terms of Use</a>
                <span className="text-secondary">&nbsp;&bull;&nbsp;</span>
                <a href="/privacy">Privacy Policy</a>
                <span className="text-secondary">&nbsp;&bull;&nbsp;</span>
                <a href="mailto:hello@slidetherapy.com">Contact Us</a>
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  }
}
