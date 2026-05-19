const Footer=()=>{

    const handleLoginClick = () => {
        // Implement navigation to the login page
        window.location.href = '/login'; // Adjust the URL as needed
      } 

    return(
        <div>
         <footer className="w-full bg-surface-container-low dark:bg-on-surface border-t border-outline-variant dark:border-secondary-container">
        <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-headline text-lg font-bold text-on-surface dark:text-surface">
            © 2024 Lumina Tech. Engineering the future.
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <a
              className="font-body text-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 underline-offset-4 transition-all duration-200"
              href="#support"
            >
              Support
            </a>
            <a
              className="font-body text-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 underline-offset-4 transition-all duration-200"
              href="#privacy"
            >
              Privacy Policy
            </a>
            <a
              className="font-body text-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 underline-offset-4 transition-all duration-200"
              href="#terms"
            >
              Terms of Service
            </a>
            <a
              className="font-body text-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 underline-offset-4 transition-all duration-200"
              href="#shipping"
            >
              Shipping
            </a>
            <a
              className="font-body text-sm text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed underline decoration-2 underline-offset-4 transition-all duration-200"
              href="#returns"
            >
              Returns
            </a>
          </nav>
          <button
            className="text-primary font-semibold hover:text-primary-container transition-colors"
            onClick={handleLoginClick}
          >
            Already have an account? Login
          </button>
        </div>
      </footer></div>
    )
}

export default Footer;