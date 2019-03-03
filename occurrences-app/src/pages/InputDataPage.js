import React from 'react'

export default function InputDataPage() {
  return (
    <div className="container is-fluid has-text-centered">
      <a className="button is-info">INPUT NEW OCCURRENCE</a>
      <hr/>
      <h3>copy from previous entries</h3>
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
        <tr>
          <th></th>
          <th>Date Added</th>
          <th>Scientific Name</th>
          <th>Dataset</th>
          <th>Occurrence Date</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><a className="button is-info">edit</a></td>
          <td>01/12/2011</td>
          <td>Abra Alba</td>
          <td>NPPSD Short-tailed Albatross Sightings</td>
          <td>09/12/2001</td>
          <td><a className="button is-info">copy</a></td>
        </tr>
        <tr>
          <td><a className="button is-info">edit</a></td>
          <td>01/12/2011</td>
          <td>Abra Alba</td>
          <td>NPPSD Short-tailed Albatross Sightings</td>
          <td>09/12/2001</td>
          <td><a className="button is-info">copy</a></td>
        </tr>
        </tbody>
      </table>
    </div>
  )
}
