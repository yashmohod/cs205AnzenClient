import {Button} from 'rsuite';

export default function LoadingButton({loading, text}) {

    return (
        <div>
            <Button loading={loading} appearance="primary" class="btn btn-primary" color="blue" active>{text}</Button>
        </div>
    )
}