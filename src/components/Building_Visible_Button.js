import { ReactComponent as ButtonSVG} from "assets/BuildingVisibilityButton.svg";

export default function BuildingVisibleButton(props){
    const onClick = () => {
        props.onClick();
    }

    return (
        <ButtonSVG className="Building_Visible_Button" onClick={onClick}/>
    );
}