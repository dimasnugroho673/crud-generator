import { Link } from 'react-router-dom';

export default function AuthLayout(props) {
    return (
        <div className="page page-center">
            {props.children}
        </div>
    )
}