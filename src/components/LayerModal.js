export const LayerModal = ({ visibleLayerIDs, setVisibleLayerIDs }) => {
    const changeValue = (e) => {

        console.log(visibleLayerIDs)
    };

    return (
        <fieldset className="BuilidingLayers_RadioButtonContainer">
            {Array.from(visibleLayerIDs).map(([k, v]) => {
                return (
                    <div key={k}>
                        <input id={k} type="checkbox" name="building-layers"
                            value={k} checked={v.visibility} onChange={changeValue} className="visually-hidden"/>
                        <label htmlFor={k}>
                            <span>{v.description}</span>
                        </label>
                    </div>
                )
            })}
        </fieldset>
    )
}