import React from 'react'

const ResultTable = ({results}) => {


    if (!results || results.length === 0) {
        return <div>No Verdict available</div>;
      }
    
    console.log(results);
    const result = results[0];

    const {testResults} = result[0];
    console.log(2,testResults,result[1]);
    const {tests,failed,passed} = result[1];
    const testData = Object.keys(testResults);

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Testcase</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
           {testData.map((keys,id) => (
            <tr key={id}>
              <td>{keys}</td>
              <td>{testResults[keys]}</td>
            </tr>
          ))} 
        </tbody>
      </table>
     <div className='statistics'>
        <h2>Total Testcases : {tests}</h2>
        <h2>Passed Testcases: {passed}</h2>
        <h2>Failed Testcases: {failed}</h2>
     </div>
    </div>
  )
}

export default ResultTable