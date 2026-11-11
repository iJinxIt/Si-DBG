function Footer(){
    return (
        <footer className="footer">
            <div>
                Version {__APP_VERSION__} · {__GIT_COMMIT__}{__GIT_DIRTY__ ? '-dirty' : ''}
            </div>
        </footer>
    )
}

export default Footer
