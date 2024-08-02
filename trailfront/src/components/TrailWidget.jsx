import './TrailWidget.css'

function TrailWidget(props) {
  return (
    <>
      <div className="trailwidget-container">
        <img src={props.preview} alt="trail image" />
        <h1>{props.trailname}</h1>
        <p>Difficulty: {props.difficulty}</p>
      </div>
    </>
  )
}

export default TrailWidget
