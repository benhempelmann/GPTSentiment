import {useState, useEffect} from 'react';
export default function OptionPicker(props){
    const [types, setTypes] = useState([]);

    useEffect(()=>{
        async function getOptions(){
          const res = await fetch('/analysisOptions');
          const json = await res.json();
          setTypes(json);
          props.setSelected(json[0]);
        }
        getOptions();
      },[])

      function handleOptionChange(e){
        props.setSelected(e.target.value);
      }

    return (
        <div className="border p-4 my-3 h-full w-[40%] rounded-md ml-3">
            <h4 className="text-lg font-semibold">
                Select the Type of Analysis to do
            </h4>
            <div className='flex flex-row flex-wrap justify-center'>
                {
                    types.map((type, idx)=>{
                        return(
                            <label key={'option'+ idx} className="flex w-min-[20%] bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3 mr-2  hover:bg-gray-300 cursor-pointer ">
                                <input type="radio" name="Option" value={type} onChange={handleOptionChange} defaultChecked={idx === 0}/>
                                <i className="pl-2">{type}</i>
                            </label>
                        )        
                    })
                }
                

            </div>
        </div>
    )
}