/* eslint-disable react/jsx-closing-tag-location */
import React from 'react'

export default class Formats extends React.Component {
  render () {
    return <div className="container text-center mt-4">
      <div className="row">
        <div className="col">
          <h3 className="mb-4">Formats Included</h3>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-center align-items-center mx-auto">
        <div
          className="col" style={{
            maxWidth: '175px'
          }}
        >
          <img className="img-fluid" src="/images/home/powerpoint.png" alt="PowerPoint" />
        </div>
        <div
          className="col" style={{
            maxWidth: '175px'
          }}
        >
          <img className="img-fluid" src="/images/home/keynote.png" alt="Keynote" />
        </div>
        <div
          className="col" style={{
            maxWidth: '175px'
          }}
        >
          <img className="img-fluid" src="/images/home/google-slides.png" alt="Google Slides" />
        </div>
      </div>
    </div>
  }
}
