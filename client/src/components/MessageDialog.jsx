export default function MessageDialog({message}){
    return(
        message &&
            <dialog>
                {message}
            </dialog>
    )
};