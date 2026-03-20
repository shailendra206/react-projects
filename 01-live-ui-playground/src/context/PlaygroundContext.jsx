import { Children, createContext, useContext, useState } from "react";


const PlaygroundContext = createContext();

export const PlaygroundProvider = ({children}) => {
    const [borderRadius, setBorderRadius] = useState(4)
    const [shadow, setShadow] = useState('LG')
    const [fontSize, setFontSize] = useState(13)
    const [buttonText, setButtonText] = useState('Get Started Now')
    const [accentColor, setAccentColor] = useState('')
    const [padding, setPadding] = useState(14)

    return (
        <PlaygroundContext.Provider value = {{
            borderRadius,setBorderRadius, 
            shadow, setShadow, 
            fontSize, setFontSize,
            buttonText, setButtonText,
            accentColor, setAccentColor, 
            padding, setPadding
        }}>
            {children}
        </PlaygroundContext.Provider>
    )
}

export const usePlayground = () => {
    return useContext(PlaygroundContext)
}