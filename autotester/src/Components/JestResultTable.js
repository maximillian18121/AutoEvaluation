import React from 'react'

const JestResultTable = ({results}) => {


    if (!results || results.length === 0) {
        return <div>No Verdict available</div>;
      }
    
    console.log(results);
    const resultStats = results[0];
    const {numTotalTests, numPassedTests, numFailedTests} = resultStats[0];
    const testData = resultStats[1];
    console.log(1,testData);

    if(numTotalTests === 0 && numPassedTests === 0 && numFailedTests === 0){
      return (
        <>
        <div className='error-section'>
          <h2 className='error-title'>Test suite failed to run: Jest encountered an unexpected token</h2>
          <h4 className='error-message'>{testData[0]}</h4>
        </div>
        </>
      )
    } 

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Testcase</th>
            <th>Status</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody>
           {testData?.map((result,id) => (
            <tr key={id}>
              <td>{result.title}</td>
              <td>{result.status}</td>
              <td>{result.verdict}</td>
            </tr>
          ))} 
        </tbody>
      </table>
     <div className='statistics'>
        <h2>Total Testcases : {numTotalTests}</h2>
        <h2>Passed Testcases: {numPassedTests}</h2>
        <h2>Failed Testcases: {numFailedTests}</h2>
     </div>
    </div>
  )
}

export default JestResultTable