import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from '@/lib/axios'

export default function ActivityTab() {
  const [recentActivities, setRecentActivities] = useState<Array<{
    timestamp: string,
    restaurant: string,
    action: string
  }>>([])

  const getData = async () => {
    // Fetch data from the server
    const response = await api.get("/superuser/activity")
    setRecentActivities(response.data)
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString() // Extracts the date
    const formattedTime = date.toLocaleTimeString() // Extracts the time
    return `${formattedDate} ${formattedTime}`
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Platform Activity</CardTitle>
        <CardDescription>Latest actions and events across all pubs</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Pub</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              activity.restaurant !== null ? (
                <TableRow key={activity.timestamp}>
                  <TableCell>{formatDateTime(activity.timestamp)}</TableCell>
                  <TableCell>{activity.restaurant}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                </TableRow>
              ) : null
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}