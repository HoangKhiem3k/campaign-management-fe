import React from 'react';
import './Dashboard.css';
export default function Dashboard() {
  return (
    <>
      <div className="block">
        <div className="search-bar">
          <input type="search" placeholder="Search" />
        </div>

        <div className="datetime">
          <div className="form-control">
            <span>Start Time: </span>
            <input type="datetime-local" className="start-time" id="time_start"></input>
          </div>
          <div className="form-control">
            <span>End Time: </span>
            <input type="datetime-local" className="end-time" id="end_start"></input>
          </div>
        </div>
      </div>
      <div className="table-main">
        <div className="table-content">
          <table>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Used Amount</th>
              <th>Usage Rate</th>
              <th>Budget</th>
              <th>Start date</th>
              <th>End date</th>
            </tr>
            <tr>
              <td>Anom</td>
              <td>
                <i className="green far fa-circle"></i>
              </td>
              <td>¥10</td>
              <td>0.5%</td>
              <td>¥100000</td>
              <td>2020-12-12 10:00</td>
              <td>2020-12-14 12:59</td>
            </tr>
            <tr>
              <td>Megha</td>
              <td>
                <i className="red far fa-circle"></i>
              </td>
              <td>¥10</td>
              <td>0.5%</td>
              <td>¥100000</td>
              <td>2020-12-12 10:00</td>
              <td>2020-12-14 12:59</td>
            </tr>
            <tr>
              <td>Subham</td>
              <td>
                <i className="red far fa-circle"></i>
              </td>
              <td>¥10</td>
              <td>0.5%</td>
              <td>¥100000</td>
              <td>2020-12-12 10:00</td>
              <td>2020-12-14 12:59</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="page-navigation">
        <div className="page-navigation-btn">
          <button className="fas fa-chevron-left" />
          <span>1 ............. 10</span>
          <button className="fas fa-chevron-right" />
        </div>
      </div>
    </>
  );
}
