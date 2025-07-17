import { PropsWithChildren } from "react"
import Navigation from "./components/Navigation"
import { AppProvider } from "./context/AppContext"

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <AppProvider>
            <Navigation />
            <main>
                {children}
            </main>
        </AppProvider>
    )
}
