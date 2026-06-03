export default function LoadingDialog({message}){
    return(
        message &&
            <dialog>
                {message}
            </dialog>
    )
};