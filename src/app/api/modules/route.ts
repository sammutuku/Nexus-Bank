import { NextResponse } from 'next/server';
import modulesData from '../../../data/modules.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: modulesData.modules.length,
      modules: modulesData.modules
    });
  } catch (error) {
    console.error('Error loading modules:', error);
    return NextResponse.json({
      success: false,
      message: "Failed to load modules",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}