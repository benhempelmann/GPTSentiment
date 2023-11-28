import {useState, useEffect} from 'react'
import FileSelector from './FileSelector';
import OptionPicker from './OptionPicker';

import loadingGif from './assets/loading.webp'
function App() {
  const [analysisTypes, setAnalysisTypes] = useState([]);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(null);
  const [file, setFile] = useState(undefined);
  const [uploaded, setUploaded] = useState(false);
  const [response, setResponse] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [inputType, setInputType] = useState("file");

  async function uploadFile(e){
    e.preventDefault();
    setUploaded(true);
    setWaiting(true);
    let formData = new FormData();
    formData.append('file', file);
    formData.append('analysisType', selectedAnalysisType);
    const res  = await fetch('/fileUpload',{
      method: "POST",
      mode: 'cors',
      body: formData
    });
    const json = await res.json();
    setWaiting(false);
    setResponse(JSON.parse(json));
  }

  async function handleURLUpload(e){
    e.preventDefault();
    console.log(e.target[0].value)
    setUploaded(true);
    setWaiting(true);
    let formData = new FormData();
    formData.append('url', e.target[0].value);
    formData.append('analysisType', selectedAnalysisType);
    const res  = await fetch('/urlUpload',{
      method: "POST",
      mode: 'cors',
      body: formData
    });
    const json = await res.json();
    setWaiting(false);
    setResponse(JSON.parse(json));
  }

  function handleFileChange(e){
    setFile(e.target.files[0]);
  }

  function handleInputTypeChange(e){
    setInputType(e.target.value)
  }

  return (
    <div className='w-[100vw] h-[100vh] text-white text-center flex flex-col items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950 via-gray-900 to-black'>
      <div className='flex flex-col justify-center items-center w-full h-[10%] bg-black border-b mb-5'>
        <h1 className='text-3xl text-transparent bg-clip-text inline-block bg-gradient-to-r from-orange-400 to-sky-400'>GPT Sentiment Analysis</h1>
        <div className='flex flex-row'>
          <label className="flex w-min-[20%] text-white rounded-md mr-2  hover:bg-gray-600 cursor-pointer ">
              <input type="radio" name="Option1" value='file' onChange={handleInputTypeChange} defaultChecked={inputType==='file'}/>
              <i className="pl-2">File Upload</i>
          </label>
          <label className="flex w-min-[20%] text-white rounded-md px-3 mr-2  hover:bg-gray-600 cursor-pointer ">
              <input type="radio" name="Option1" value='url' onChange={handleInputTypeChange} defaultChecked={inputType==='url'}/>
              <i className="pl-2">URL</i>
          </label>
        </div>
      </div>
      <div className='flex flex-row justify-center items-center mb-3 w-full'>
        {inputType==="file"?<FileSelector file={file} handleFileChange={handleFileChange}/>:
        <form className='w-[50%]' onSubmit={handleURLUpload}>
          <label htmlFor="helper-text" className="block mb-2 text-sm font-medium text-white">Website URL</label>
          <div className='flex flex-row'>
            <input type="text" id="helper-text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="exampleURL.com"></input>
            <button type='submit' className='border px-2 py-1 hover:brightness-75'>
              Upload
            </button>
          </div>
        </form>
        }
        {
          <OptionPicker setSelected={setSelectedAnalysisType}/>}
      </div>
      {(file!==undefined && inputType ==='file')?
        
        <button onClick={uploadFile} className='border mt-1 px-2 py-1 hover:brightness-75'>
          Upload File
        </button>
        :<></>}
      {uploaded? 
        <div className='flex flex-col w-[60%] min-h-[40%] mt-8 bg-gray-700 rounded-lg text-white'>
            <h1 className='mt-1 border-b w-fit self-center'>Output</h1>
            {
              waiting?<img src={loadingGif} alt="loading..." className='self-center mt-10'/>: 
              <div className='flex flex-col text-left m-3 overflow-scroll'>
                <h3>Title:&emsp;{response.title}</h3>
                <h3>Classification:&emsp;{response.classification}</h3>
                <h3>Summary:</h3>
                <p className='ml-5'>{response.summary}</p>
                <h3>Reasoning:</h3>
                <p className='ml-5'>{response.reasoning}</p>
              </div>
            }
        </div>:<></>}
        
    </div>
  );
}

export default App;
