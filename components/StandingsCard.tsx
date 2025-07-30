"use client";

import React, {useMemo} from "react";
import {TShirtIcon} from "@phosphor-icons/react/dist/ssr";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {calculateStandings, type Match as MatchType} from "@/lib/utils";

interface StandingsCardProps {
    matches: MatchType[];
}

const StandingsCard = ({matches}: StandingsCardProps) => {
    // Calculate standings using utility function
    const standings = useMemo(() => calculateStandings(matches), [matches]);

    return (
        <div className="w-full px-4">
            <div className="bg-white rounded-lg shadow border p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Standings</h2>

                    <Select defaultValue="2024-2025" disabled>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Season"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024-2025">2024/2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Standings Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12 text-center">#</TableHead>
                                <TableHead className="w-16"></TableHead>
                                <TableHead className="w-16 text-center">PL</TableHead>
                                <TableHead className="w-16 text-center">W</TableHead>
                                <TableHead className="w-16 text-center">L</TableHead>
                                <TableHead className="w-20 text-center hidden md:table-cell">+/-</TableHead>
                                <TableHead className="w-16 text-center">GD</TableHead>
                                <TableHead className="w-16 text-center">PTS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {standings.map((team, index) => (
                                <TableRow key={team.team}>
                                    <TableCell className="text-center font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center md:justify-start">
                                            <TShirtIcon size={20} color={team.color} weight="fill"/>
                                            <span className="text-sm ml-2 hidden md:inline">{team.team}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{team.played}</TableCell>
                                    <TableCell className="text-center">{team.wins}</TableCell>
                                    <TableCell className="text-center">{team.losses}</TableCell>
                                    <TableCell className="text-center hidden md:table-cell">
                                        {team.goalsFor}-{team.goalsAgainst}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span>{team.goalDifference > 0 ? "+" : ""}{team.goalDifference}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {team.points}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default StandingsCard;