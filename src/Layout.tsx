import { PropsWithChildren } from "react"
import Navigation from "./components/Navigation"
import { SearchProvider } from "./context/SearchContext"

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <div>
            <SearchProvider>
                <Navigation />
                <main>
                    {children}
                </main>
            </SearchProvider>
        </div>
    )
}