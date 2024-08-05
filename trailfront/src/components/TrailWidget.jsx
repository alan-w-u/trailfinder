import { useNavigate } from "react-router-dom";
import './Home.css'

const TrailWidget = ({ trail }) => {
    const navigate = useNavigate();

    const handleTrailWidgetClick = () => {
        navigate('/trail', {
            state: {
                locationname: trail.LOCATIONNAME, latitude: trail.LATITUDE, longitude: trail.LONGITUDE, trailname: trail.TRAILNAME,
                timetocomplete: trail.TIMETOCOMPLETE.match(/\d{2}:\d{2}/), description: trail.DESCRIPTION, hazards: trail.HAZARDS, difficulty: trail.DIFFICULTY
            }
        });
    };

    return (
        <div className="trailwidget" onClick={handleTrailWidgetClick}>
            <img src="./trailfinder.png" alt="trail image" />
            <h1>{trail.TRAILNAME}</h1>
            <em>{trail.LOCATIONNAME}</em>
            <p>&nbsp;</p>
            <p>Time to Complete : <b>{trail.TIMETOCOMPLETE.match(/\d{2}:\d{2}/)}</b></p>
            <p>Difficulty : <b>{trail.DIFFICULTY}</b></p>
        </div>
    );
}

export default TrailWidget
