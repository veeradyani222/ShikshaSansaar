import React, { useEffect, useState } from "react";
import "./ViewAnalytics.css";

const ViewAnalytics = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Default dates: One month ago and today
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  });

  const [analyticsData, setAnalyticsData] = useState(null); // State to store analytics data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${BACKEND_URL}/analytics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
  
      const data = await response.json();
      console.log("Fetched Analytics Data:", data); // Log the data here
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics data:", err.message); // Log the error
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch analytics data when the component loads or the date range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [startDate, endDate]);

  return (
    <div className="view-analytics">
      <div className="date-picker">
        <div className="date-input">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button onClick={fetchAnalyticsData}>Fetch Data</button>
      </div>

      {loading && <p className="loading">Loading analytics data...</p>}
      {error && <p className="error">Error: {error}</p>}

      {analyticsData && (
        <div className="analytics-data">
          <div className="box">
            <h3>Total Revenue</h3>
            <p>₹ {analyticsData.totalRevenue}</p>
          </div>

          <div className="box">
            <h3>Average Order Value</h3>
            <p> {analyticsData.averageOrderValue}</p>
          </div>

          <div className="box">
            <h3>Most Bought Category</h3>
            <p> {analyticsData.mostBoughtCategory}</p>
          </div>

          <div className="box">
            <h3>Most Bought Course</h3>
            <p> {analyticsData.mostBoughtCourse}</p>
          </div>

          <div className="box">
            <h3>Most Bought Faculty</h3>
            <p> {analyticsData.mostBoughtFaculty}</p>
            </div>

            <div className="box">
            <h3>Most Bought Mode</h3>
            <p> {analyticsData.mostBoughtMode}</p>
            </div>

            <div className="box">
            <h3>Most Bought Sub-Category</h3>
            <p>{analyticsData.mostBoughtSubCategory}</p>
            </div>

            <div className="box">
            <h3>Most Bought Views</h3>
            <p> {analyticsData.mostBoughtViews}</p>
            </div>

            <div className="box">
            <h3>Most Bought Validity</h3>
            <p> {analyticsData.mostBoughtValidity}</p>
            </div>

            <div className="box">
            <h3>Top Day</h3>
            <p> {analyticsData.topDayOfWeek}</p>
            </div>

            <div className="box">
            <h3>Total Discount</h3>
            <p>₹ {analyticsData.totalDiscount}</p>
            </div>

            <div className="box">
  <h3>Number of Orders</h3>
  <p>
    {analyticsData.orderCount
      ? Object.values(analyticsData.orderCount).reduce((acc, count) => acc + count, 0)
      : 0}
  </p>
</div>

        {/* Top 10 Courses Table */}
          <div className="table-box">
            <h3>Top 10 Courses</h3>
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Purchases</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.top10Courses.map(([course, count], index) => (
                  <tr key={index}>
                    <td>{course}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top 10 Faculties Table */}
          <div className="table-box">
            <h3>Top 10 Faculties</h3>
            <table>
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Purchases</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.top10Faculties.map(([faculty, count], index) => (
                  <tr key={index}>
                    <td>{faculty}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAnalytics;