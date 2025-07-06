
const OwnModel = ({setClasses, setModel, isModel, setIsModel}) => {
    const handleModelUpload = (e) => {
        var file = e.target.files[0];
        setModel(file);
    }
    
    const handleClassesUpload = (e) => {
        var file = e.target.files[0];
        setClasses(file);
    }

    const handleChange = (event) => {
        setIsModel(event.target.checked);
    };

     return (
        <div className="flex flex-col space-y-4 w-full">
        <input type="file" onChange={handleModelUpload} className="border p-2 rounded" />
        <input type="file" onChange={handleClassesUpload} className="border p-2 rounded" />
        
        <label className="flex items-center space-x-2">
            <input
            type="radio"
            name="example"
            checked={isModel}
            onChange={handleChange}
            />
            <span>Use custom model</span>
        </label>
        </div>
    );
};


export default OwnModel;