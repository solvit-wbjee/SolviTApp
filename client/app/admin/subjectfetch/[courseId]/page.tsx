"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useGetSubjectsToYearQuery } from '@/redux/features/courses/coursesApi';



const CourseSubjectsPage = () => {
    const router = useRouter();
    const { courseId, yearId } = router.query;

    const { data: subjects, isLoading, error } = useGetSubjectsToYearQuery({ courseId, yearId });

    useEffect(() => {
        if (error) {
            toast.error('Error fetching subjects');
        }
    }, [error]);

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography>Error loading subjects</Typography>;

    return (
        <Box m="20px">
            <Typography variant="h4" mb="20px">Subjects for Course {courseId} in Year {yearId}</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Subject Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subjects && subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell>{subject.name}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No subjects found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Box>
    );
};

export default CourseSubjectsPage;
