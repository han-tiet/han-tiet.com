import { createContext, useContext, ReactNode, useState, useEffect } from 'react' // createContext is an object

interface User {
  username: string
  email: string
  city: string
}

interface UserProviderProps {
  children: ReactNode
}
const UserContext = createContext<User | null>(null)
export const useUser = () => useContext(UserContext) // Remember to export the context

export const UserProvider = ({children}: UserProviderProps) => {
  const [user, setUser]: any = useState<User | null>(null)

  useEffect (() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch ("https://jsonplaceholder.typicode.com/users/1")
        if (!resp.ok) throw new Error('Failed to fetch user')
        const data: User = await resp.json() // assign json to User
        console.log(data)
        setUser(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUser(null)
      }
    }

    fetchUser() // Call fetchUser
  }, [])    // Empty dependency array means function only runs once on mount


  return(
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}