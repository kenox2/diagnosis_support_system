
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
        <div className="chooseModel">
            <input type="file"  onChange={handleModelUpload} />
            <input type="file"  onChange={handleClassesUpload} />
            <label>    
                <input
                type="radio"
                name="example"
                checked={isModel}
                onChange={handleChange}
                />
                Use custom model
            </label>
        </div>
    );
}

export default OwnModel;