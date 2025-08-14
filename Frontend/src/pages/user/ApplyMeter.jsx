import React, { useState } from 'react'

const ApplyMeter = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        address: "",
        meterType: "",
        meterTech: ""
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('userToken')

        try {
            const response = await fetch('http://localhost:4500/user_meter/apply', {
              method: 'POST',
              headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
              body: JSON.stringify({formData})
            })
      
            const data = await response.json()
            alert(data.msg || "Applicaton submitted!")
            } catch (e) {
                console.error(e)
                alert('Error applying for meter')
            }
          
    }

    return (
        <div>
            <h2>Apply for a Meter</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} /><br />
                <input type="text" name="address" placeholder="Address" onChange={handleChange} /><br />
                <select name="meterType" onChange={handleChange}>
                    <option value="">Select Meter Type</option>
                    <option value="prepaid">Prepaid</option>
                    <option value="postpaid">Postpaid</option>
                </select><br />
                <select name="meterTech" onChange={handleChange}>
                    <option value="">Select Technology</option>
                    <option value="sts">STS</option>
                    <option value="iot">IoT</option>
                </select><br />
                <button type="submit">Apply</button>
            </form>
        </div>
    )
}

export default ApplyMeter