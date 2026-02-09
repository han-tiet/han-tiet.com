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

export const UserProvider = ({children}: UserProviderProps) => { // UserProvider can be part of UserContext component
  const [user, setUser]: any = useState<User | null>(null) // Sets state of user. Meaning of useState<T>?

  // useEffect contains fetch logic to sync page with json data
  useEffect (() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch("https://jsonplaceholder.typicode.com/users/1")
        if (!resp.ok) throw new Error('Failed to fetch user')
        const data: User = await resp.json() // data: User means data attributes should match interface User
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